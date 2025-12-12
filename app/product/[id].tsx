import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Star, ShoppingCart, Heart } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { products } from '@/mocks/products';
import { useCart } from '@/contexts/cart';
import { useSaved } from '@/contexts/saved';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { addToCart, cartItemsCount } = useCart();
  const { toggleSaved, isSaved } = useSaved();
  
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Product Not Found' }} />
        <Text>Product not found</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addToCart(product);
  };

  const handleToggleSaved = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleSaved(product);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: '',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleToggleSaved}
              >
                <Heart 
                  size={24} 
                  color={isSaved(product.id) ? Colors.light.error : Colors.light.text}
                  fill={isSaved(product.id) ? Colors.light.error : 'transparent'}
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerCartButton}
                onPress={() => router.push('/cart' as any)}
              >
                <ShoppingCart size={24} color={Colors.light.text} />
                {cartItemsCount > 0 && (
                  <View style={styles.headerBadge}>
                    <Text style={styles.headerBadgeText}>{cartItemsCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          contentFit="cover"
        />

        <View style={styles.content}>
          <View style={styles.ratingRow}>
            <Star size={16} color={Colors.light.secondary} fill={Colors.light.secondary} />
            <Text style={styles.rating}>{product.rating}</Text>
            <Text style={styles.reviews}>({product.reviews} reviews)</Text>
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>₵{product.price}</Text>
            {product.originalPrice && (
              <>
                <Text style={styles.originalPrice}>₵{product.originalPrice}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </Text>
                </View>
              </>
            )}
          </View>

          {product.inStock ? (
            <View style={styles.stockBadge}>
              <View style={styles.stockDot} />
              <Text style={styles.stockText}>In Stock</Text>
            </View>
          ) : (
            <View style={[styles.stockBadge, styles.outOfStockBadge]}>
              <View style={[styles.stockDot, styles.outOfStockDot]} />
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>Electronics</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Rating</Text>
              <Text style={styles.detailValue}>{product.rating} / 5.0</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Availability</Text>
              <Text style={styles.detailValue}>{product.inStock ? 'In Stock' : 'Out of Stock'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.addToCartButton, !product.inStock && styles.disabledButton]}
          onPress={handleAddToCart}
          disabled={!product.inStock}
        >
          <ShoppingCart size={20} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerButtons: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    marginRight: 8,
  },
  headerButton: {
    padding: 4,
  },
  headerCartButton: {
    position: 'relative' as const,
  },
  headerBadge: {
    position: 'absolute' as const,
    top: -6,
    right: -6,
    backgroundColor: Colors.light.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 6,
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700' as const,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  productImage: {
    width: width,
    height: width,
    backgroundColor: Colors.light.surface,
  },
  content: {
    padding: 16,
  },
  ratingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
    gap: 4,
  },
  rating: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  reviews: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
    gap: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  originalPrice: {
    fontSize: 18,
    color: Colors.light.textSecondary,
    textDecorationLine: 'line-through' as const,
  },
  discountBadge: {
    backgroundColor: Colors.light.error,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700' as const,
  },
  stockBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 24,
    gap: 8,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.success,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.success,
  },
  outOfStockBadge: {
    opacity: 0.7,
  },
  outOfStockDot: {
    backgroundColor: Colors.light.error,
  },
  outOfStockText: {
    color: Colors.light.error,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.light.textSecondary,
  },
  detailRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  detailLabel: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.light.card,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  addToCartButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
