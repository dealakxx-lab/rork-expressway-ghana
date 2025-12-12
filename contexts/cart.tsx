import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Product } from '@/mocks/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = 'expressway_cart';

export const [CartProvider, useCart] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [cart, setCart] = useState<CartItem[]>([]);

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (items: CartItem[]) => {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      return items;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data);
    },
  });

  useEffect(() => {
    if (cartQuery.data) {
      setCart(cartQuery.data);
    }
  }, [cartQuery.data]);

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cart.find((item) => item.product.id === product.id);
    
    let updatedCart: CartItem[];
    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...cart, { product, quantity }];
    }
    
    setCart(updatedCart);
    saveMutation.mutate(updatedCart);
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    setCart(updatedCart);
    saveMutation.mutate(updatedCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    saveMutation.mutate(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    saveMutation.mutate([]);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartItemsCount,
    isLoading: cartQuery.isLoading,
  };
});
