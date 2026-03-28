import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin' | 'seller';
}

const AUTH_STORAGE_KEY = 'expressway_auth';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const authQuery = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (userData: User | null) => {
      if (userData) {
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      }
      return userData;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], data);
    },
  });

  useEffect(() => {
    if (authQuery.data !== undefined) {
      setUser(authQuery.data);
      setIsLoading(false);
    } else if (!authQuery.isLoading) {
      setIsLoading(false);
    }
  }, [authQuery.data, authQuery.isLoading]);

  const signIn = async (email: string, password: string) => {
    console.log('Signing in:', email);
    
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: email,
      phone: '+233 24 123 4567',
      role: email.includes('admin') ? 'admin' : email.includes('seller') ? 'seller' : 'user',
    };
    
    setUser(mockUser);
    saveMutation.mutate(mockUser);
    return mockUser;
  };

  const signUp = async (name: string, email: string, phone: string, password: string, role: 'user' | 'admin' | 'seller' = 'user') => {
    console.log('Signing up:', email, 'as', role);
    
    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      role,
    };
    
    setUser(mockUser);
    saveMutation.mutate(mockUser);
    return mockUser;
  };

  const signOut = () => {
    console.log('Signing out');
    setUser(null);
    saveMutation.mutate(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isSeller: user?.role === 'seller',
    signIn,
    signUp,
    signOut,
  };
});
