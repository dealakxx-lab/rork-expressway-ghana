import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CartProvider } from '@/contexts/cart';
import { AuthProvider, useAuth } from '@/contexts/auth';
import { SavedProvider } from '@/contexts/saved';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inAdminGroup = segments[0] === 'admin';

    console.log('Auth state:', { isAuthenticated, isAdmin, segments });

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/auth');
    } else if (isAuthenticated && inAuthGroup) {
      if (isAdmin) {
        router.replace('/admin');
      } else {
        router.replace('/(tabs)');
      }
    } else if (isAuthenticated && isAdmin && !inAdminGroup && segments[0] !== '(tabs)') {
      router.replace('/admin');
    }
  }, [isAuthenticated, isLoading, segments, isAdmin, router]);

  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="cart" options={{ presentation: 'modal' }} />
      <Stack.Screen name="checkout" options={{ presentation: 'modal', title: 'Checkout' }} />
      <Stack.Screen name="product/[id]" options={{ title: 'Product Details' }} />
      <Stack.Screen name="user-signup" options={{ presentation: 'modal' }} />
      <Stack.Screen name="driver-signup" options={{ presentation: 'modal' }} />
      <Stack.Screen name="admin-signup" options={{ presentation: 'modal' }} />
      <Stack.Screen name="orders" options={{ title: 'My Orders' }} />
      <Stack.Screen name="saved" options={{ title: 'Saved Items' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="help" options={{ title: 'Help & Support' }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <SavedProvider>
            <GestureHandlerRootView>
              <RootLayoutNav />
            </GestureHandlerRootView>
          </SavedProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
