import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, router } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useSaved } from '@/contexts/saved';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const PRODUCT_WIDTH = (width - 48) / 2;

export default function SavedItemsScreen() {
  const { savedItems, toggleSaved, isSaved } = useSaved();

  const handleToggleSaved = (product: typeof savedItems[0], e: any) => {
    e.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleSaved(product);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'Saved Items',
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
        }} 
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={savedItems.length === 0 ? styles.emptyContainer : styles.scrollContent}
      >
        {savedItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Heart size={64} color={Colors.light.textSecondary} />
            <Text style={styles.emptyTitle}>No Saved Items</Text>
            <Text style={styles.emptyText}>
              Items you save for later will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {savedItems.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                onPress={() => router.push(`/product/${product.id}`)}
              >
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  contentFit="cover"
                />
                {product.originalPrice && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={(e) => handleToggleSaved(product, e)}
                >
                  <Heart
                    size={20}
                    color={isSaved(product.id) ? Colors.light.error : '#FFFFFF'}
                    fill={isSaved(product.id) ? Colors.light.error : 'transparent'}
                  />
                </TouchableOpacity>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>₵{product.price}</Text>
                    {product.originalPrice && (
                      <Text style={styles.originalPrice}>₵{product.originalPrice}</Text>
                    )}
                  </View>
                  <View style={styles.ratingRow}>
                    <Text style={styles.rating}>⭐ {product.rating}</Text>
                    <Text style={styles.reviews}>({product.reviews})</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 32,
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 20,
  },
  productsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    paddingHorizontal: 16,
    gap: 16,
  },
  productCard: {
    width: PRODUCT_WIDTH,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  productImage: {
    width: '100%',
    height: PRODUCT_WIDTH,
    backgroundColor: Colors.light.surface,
  },
  discountBadge: {
    position: 'absolute' as const,
    top: 8,
    left: 8,
    backgroundColor: Colors.light.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700' as const,
  },
  saveButton: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 4,
    gap: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  originalPrice: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textDecorationLine: 'line-through' as const,
  },
  ratingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  rating: {
    fontSize: 13,
    color: Colors.light.text,
    fontWeight: '500' as const,
  },
  reviews: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});
