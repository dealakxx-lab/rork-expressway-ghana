import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { User, LogOut, Package, Heart, Settings, HelpCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/auth';
import Colors from '@/constants/colors';

export default function AccountScreen() {
  const router = useRouter();
  const { user, signOut, isAdmin } = useAuth();

  const handleSignOut = () => {
    signOut();
    router.replace('/auth');
  };

  const handleAdminAccess = () => {
    router.push('/admin');
  };

  const handleMyOrders = () => {
    router.push('/orders');
  };

  const handleSavedItems = () => {
    router.push('/saved');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleHelp = () => {
    router.push('/help');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={48} color={Colors.light.primary} />
          </View>
          <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.subtitle}>{user?.email}</Text>
          {user?.phone && (
            <Text style={styles.phone}>{user.phone}</Text>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={handleMyOrders}>
            <Package size={20} color={Colors.light.text} />
            <Text style={styles.menuText}>My Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleSavedItems}>
            <Heart size={20} color={Colors.light.text} />
            <Text style={styles.menuText}>Saved Items</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
            <Settings size={20} color={Colors.light.text} />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleHelp}>
            <HelpCircle size={20} color={Colors.light.text} />
            <Text style={styles.menuText}>Help & Support</Text>
          </TouchableOpacity>
        </View>

        {isAdmin && (
          <TouchableOpacity style={styles.adminButton} onPress={handleAdminAccess}>
            <Text style={styles.adminButtonText}>Admin Dashboard</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color={Colors.light.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
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
  content: {
    flex: 1,
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center' as const,
    paddingVertical: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  name: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  phone: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  section: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden' as const,
  },
  menuItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  menuText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '500' as const,
  },
  adminButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center' as const,
    marginTop: 16,
  },
  adminButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  signOutButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  signOutText: {
    fontSize: 16,
    color: Colors.light.error,
    fontWeight: '600' as const,
  },
});
