import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Package, Plus, TrendingUp, DollarSign, Eye, LogOut, X } from 'lucide-react-native';
import { useAuth } from '@/contexts/auth';
import { products } from '@/mocks/products';
import Colors from '@/constants/colors';

interface NewProduct {
  name: string;
  price: string;
  category: string;
  description: string;
  image: string;
}

export default function SellerDashboard() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
  });

  const sellerProducts = products.slice(0, 5);
  
  const stats = {
    totalProducts: sellerProducts.length,
    totalSales: 15420,
    views: 3456,
    pendingOrders: 12,
  };

  const handleSignOut = () => {
    signOut();
    router.replace('/auth');
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.description) {
      console.log('Please fill all required fields');
      return;
    }

    console.log('Adding product:', newProduct);
    
    setShowAddModal(false);
    setNewProduct({
      name: '',
      price: '',
      category: '',
      description: '',
      image: '',
    });

    console.log('Success: Product added successfully and pending approval!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.sellerName}>{user?.name || 'Seller'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <LogOut size={20} color={Colors.light.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#F0FDF4' }]}>
              <Package size={22} color={Colors.light.primary} />
            </View>
            <Text style={styles.statValue}>{stats.totalProducts}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
              <DollarSign size={22} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>GH₵ {stats.totalSales.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Sales</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#EFF6FF' }]}>
              <Eye size={22} color="#3B82F6" />
            </View>
            <Text style={styles.statValue}>{stats.views.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Views</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FEE2E2' }]}>
              <TrendingUp size={22} color="#EF4444" />
            </View>
            <Text style={styles.statValue}>{stats.pendingOrders}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Products</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Product</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productsList}>
            {sellerProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <Image 
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                  <Text style={styles.productPrice}>GH₵ {product.price.toLocaleString()}</Text>
                  <View style={styles.productStats}>
                    <View style={styles.productStat}>
                      <Eye size={14} color={Colors.light.textSecondary} />
                      <Text style={styles.productStatText}>{Math.floor(Math.random() * 500) + 100}</Text>
                    </View>
                    <View style={[styles.statusBadge, styles.statusBadgeActive]}>
                      <Text style={styles.statusBadgeText}>Active</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.viewStoreButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.viewStoreButtonText}>View Storefront</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Product</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Product Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter product name"
                    placeholderTextColor={Colors.light.textSecondary}
                    value={newProduct.name}
                    onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Price (GH₵) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor={Colors.light.textSecondary}
                    value={newProduct.price}
                    onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Category *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Electronics, Fashion"
                    placeholderTextColor={Colors.light.textSecondary}
                    value={newProduct.category}
                    onChangeText={(text) => setNewProduct({ ...newProduct, category: text })}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Description *</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe your product..."
                    placeholderTextColor={Colors.light.textSecondary}
                    value={newProduct.description}
                    onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Image URL</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="https://example.com/image.jpg"
                    placeholderTextColor={Colors.light.textSecondary}
                    value={newProduct.image}
                    onChangeText={(text) => setNewProduct({ ...newProduct, image: text })}
                    autoCapitalize="none"
                  />
                </View>

                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={handleAddProduct}
                >
                  <Text style={styles.submitButtonText}>Add Product</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  logoutButton: {
    padding: 10,
    backgroundColor: Colors.light.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  section: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  addButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  productsList: {
    gap: 12,
  },
  productCard: {
    flexDirection: 'row' as const,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.light.border,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between' as const,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.primary,
    marginBottom: 8,
  },
  productStats: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  productStat: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  productStatText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeActive: {
    backgroundColor: '#D1FAE5',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#059669',
  },
  viewStoreButton: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center' as const,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  viewStoreButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end' as const,
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  modalScroll: {
    maxHeight: 500,
  },
  modalForm: {
    padding: 20,
    gap: 18,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  input: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top' as const,
    paddingTop: 14,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center' as const,
    marginTop: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
