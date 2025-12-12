import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useMemo } from 'react';
import { BarChart3, Package, TrendingUp, DollarSign, Users, ShoppingBag, LogOut } from 'lucide-react-native';
import { useAuth } from '@/contexts/auth';
import { products } from '@/mocks/products';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

interface SalesData {
  month: string;
  sales: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const salesData: SalesData[] = useMemo(() => [
    { month: 'Jan', sales: 45000 },
    { month: 'Feb', sales: 52000 },
    { month: 'Mar', sales: 48000 },
    { month: 'Apr', sales: 61000 },
    { month: 'May', sales: 55000 },
    { month: 'Jun', sales: 67000 },
  ], []);

  const stats = useMemo(() => {
    const totalRevenue = salesData.reduce((sum, item) => sum + item.sales, 0);
    const avgSales = totalRevenue / salesData.length;
    const totalProducts = products.length;
    const lowStockItems = products.filter((p) => (p as any).stock < 10).length;
    
    return {
      totalRevenue,
      avgSales,
      totalOrders: 1247,
      totalCustomers: 856,
      totalProducts,
      lowStockItems,
    };
  }, [salesData]);

  const maxSales = Math.max(...salesData.map((d) => d.sales));

  const handleSignOut = () => {
    signOut();
    router.replace('/auth');
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
            <Text style={styles.adminName}>{user?.name || 'Admin'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <LogOut size={20} color={Colors.light.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <View style={styles.statIcon}>
              <DollarSign size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.statValue}>GH₵ {stats.totalRevenue.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Revenue</Text>
            <View style={styles.statBadge}>
              <TrendingUp size={12} color={Colors.light.success} />
              <Text style={styles.statBadgeText}>+12.5%</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <ShoppingBag size={24} color={Colors.light.secondary} />
            </View>
            <Text style={styles.statValue}>{stats.totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
            <View style={styles.statBadge}>
              <TrendingUp size={12} color={Colors.light.success} />
              <Text style={styles.statBadgeText}>+8.2%</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Users size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.statValue}>{stats.totalCustomers}</Text>
            <Text style={styles.statLabel}>Customers</Text>
            <View style={styles.statBadge}>
              <TrendingUp size={12} color={Colors.light.success} />
              <Text style={styles.statBadgeText}>+15.3%</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Package size={24} color="#EF4444" />
            </View>
            <Text style={styles.statValue}>{stats.totalProducts}</Text>
            <Text style={styles.statLabel}>Products</Text>
            {stats.lowStockItems > 0 && (
              <View style={[styles.statBadge, styles.statBadgeWarning]}>
                <Text style={styles.statBadgeTextWarning}>{stats.lowStockItems} low stock</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <BarChart3 size={20} color={Colors.light.text} />
              <Text style={styles.sectionTitle}>Sales Overview</Text>
            </View>
            <View style={styles.periodSelector}>
              {(['week', 'month', 'year'] as const).map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive,
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      selectedPeriod === period && styles.periodButtonTextActive,
                    ]}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {salesData.map((item, index) => {
                const height = (item.sales / maxSales) * 150;
                return (
                  <View key={index} style={styles.chartBarContainer}>
                    <View style={styles.chartBarWrapper}>
                      <View style={[styles.chartBar, { height }]}>
                        <Text style={styles.chartValue}>
                          {(item.sales / 1000).toFixed(0)}k
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.chartLabel}>{item.month}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Package size={20} color={Colors.light.text} />
              <Text style={styles.sectionTitle}>Inventory Status</Text>
            </View>
          </View>

          <View style={styles.inventoryList}>
            {products.slice(0, 6).map((product) => {
              const stock = Math.floor(Math.random() * 100);
              const isLowStock = stock < 20;
              
              return (
                <View key={product.id} style={styles.inventoryItem}>
                  <View style={styles.inventoryInfo}>
                    <Text style={styles.inventoryName}>{product.name}</Text>
                    <Text style={styles.inventoryCategory}>{product.category}</Text>
                  </View>
                  <View style={styles.inventoryStock}>
                    <Text style={[styles.inventoryStockText, isLowStock && styles.inventoryStockTextLow]}>
                      {stock} units
                    </Text>
                    {isLowStock && (
                      <View style={styles.lowStockBadge}>
                        <Text style={styles.lowStockBadgeText}>Low</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.viewAllButtonText}>View Store</Text>
        </TouchableOpacity>
      </ScrollView>
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
  adminName: {
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
    minWidth: (width - 52) / 2,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statCardPrimary: {
    backgroundColor: '#F0FDF4',
    borderColor: Colors.light.primary,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  statBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    alignSelf: 'flex-start' as const,
  },
  statBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.success,
  },
  statBadgeWarning: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statBadgeTextWarning: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#92400E',
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
    flexWrap: 'wrap' as const,
    gap: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  periodSelector: {
    flexDirection: 'row' as const,
    backgroundColor: Colors.light.surface,
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  chartContainer: {
    marginTop: 8,
  },
  chart: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-end' as const,
    height: 200,
    paddingTop: 20,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'flex-end' as const,
  },
  chartBarWrapper: {
    width: '80%',
    alignItems: 'center' as const,
    justifyContent: 'flex-end' as const,
    marginBottom: 8,
  },
  chartBar: {
    width: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 6,
    justifyContent: 'flex-start' as const,
    alignItems: 'center' as const,
    paddingTop: 4,
    minHeight: 30,
  },
  chartValue: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  chartLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  inventoryList: {
    gap: 12,
  },
  inventoryItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
  },
  inventoryInfo: {
    flex: 1,
  },
  inventoryName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  inventoryCategory: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  inventoryStock: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  inventoryStockText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  inventoryStockTextLow: {
    color: Colors.light.error,
  },
  lowStockBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  lowStockBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.light.error,
  },
  viewAllButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center' as const,
    marginTop: 8,
  },
  viewAllButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
