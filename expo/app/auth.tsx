import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react-native';
import { useAuth } from '@/contexts/auth';
import Colors from '@/constants/colors';

export default function AuthScreen() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  const handleSignIn = async () => {
    if (!signInEmail || !signInPassword) {
      return;
    }
    
    setIsLoading(true);
    try {
      await signIn(signInEmail, signInPassword);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!signUpName || !signUpEmail || !signUpPhone || !signUpPassword) {
      return;
    }
    
    if (signUpPassword !== signUpConfirmPassword) {
      console.log('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      await signUp(signUpName, signUpEmail, signUpPhone, signUpPassword);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.logo}>Expressway</Text>
            <Text style={styles.subtitle}>Shop the best products in Ghana</Text>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, isSignIn && styles.tabActive]}
              onPress={() => setIsSignIn(true)}
            >
              <LogIn size={20} color={isSignIn ? Colors.light.primary : Colors.light.textSecondary} />
              <Text style={[styles.tabText, isSignIn && styles.tabTextActive]}>Sign In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, !isSignIn && styles.tabActive]}
              onPress={() => setIsSignIn(false)}
            >
              <UserPlus size={20} color={!isSignIn ? Colors.light.primary : Colors.light.textSecondary} />
              <Text style={[styles.tabText, !isSignIn && styles.tabTextActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {isSignIn ? (
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={signInEmail}
                  onChangeText={setSignInEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={signInPassword}
                  onChangeText={setSignInPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleSignIn}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              <View style={styles.demoContainer}>
                <Text style={styles.demoText}>Demo accounts:</Text>
                <Text style={styles.demoAccount}>User: user@expressway.gh</Text>
                <Text style={styles.demoAccount}>Admin: admin@expressway.gh</Text>
                <Text style={styles.demoAccountNote}>(any password works)</Text>
              </View>
            </View>
          ) : (
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={signUpName}
                  onChangeText={setSignUpName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={signUpEmail}
                  onChangeText={setSignUpEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+233 24 123 4567"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={signUpPhone}
                  onChangeText={setSignUpPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={signUpPassword}
                  onChangeText={setSignUpPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={signUpConfirmPassword}
                  onChangeText={setSignUpConfirmPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>

              <View style={styles.signupOptions}>
                <Text style={styles.signupOptionsText}>Other signup options:</Text>
                <TouchableOpacity 
                  style={styles.optionButton}
                  onPress={() => router.push('/seller-signup')}
                >
                  <Text style={styles.optionButtonText}>Become a Seller</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.optionButton}
                  onPress={() => router.push('/driver-signup')}
                >
                  <Text style={styles.optionButtonText}>Sign Up as Driver</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.optionButton}
                  onPress={() => router.push('/admin-signup')}
                >
                  <Text style={styles.optionButtonText}>Register as Admin</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center' as const,
    marginBottom: 40,
    paddingTop: 20,
  },
  logo: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: Colors.light.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row' as const,
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 4,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  tabActive: {
    backgroundColor: Colors.light.card,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  tabTextActive: {
    color: Colors.light.primary,
  },
  form: {
    gap: 20,
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center' as const,
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  demoContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  demoText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  demoAccount: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  demoAccountNote: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontStyle: 'italic' as const,
    marginTop: 4,
  },
  signupOptions: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 12,
  },
  signupOptionsText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  optionButton: {
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
    textAlign: 'center' as const,
  },
});
