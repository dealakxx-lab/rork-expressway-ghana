import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Product } from '@/mocks/products';

const SAVED_STORAGE_KEY = 'expressway_saved_items';

export const [SavedProvider, useSaved] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [savedItems, setSavedItems] = useState<Product[]>([]);

  const savedQuery = useQuery({
    queryKey: ['saved'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(SAVED_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (items: Product[]) => {
      await AsyncStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(items));
      return items;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['saved'], data);
    },
  });

  useEffect(() => {
    if (savedQuery.data) {
      setSavedItems(savedQuery.data);
    }
  }, [savedQuery.data]);

  const toggleSaved = (product: Product) => {
    const isSaved = savedItems.some((item) => item.id === product.id);
    
    let updatedSaved: Product[];
    if (isSaved) {
      updatedSaved = savedItems.filter((item) => item.id !== product.id);
    } else {
      updatedSaved = [...savedItems, product];
    }
    
    setSavedItems(updatedSaved);
    saveMutation.mutate(updatedSaved);
  };

  const isSaved = (productId: string) => {
    return savedItems.some((item) => item.id === productId);
  };

  return {
    savedItems,
    toggleSaved,
    isSaved,
    isLoading: savedQuery.isLoading,
  };
});
