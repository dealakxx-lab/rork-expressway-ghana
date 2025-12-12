import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Shield, Mail, Lock, User, Building } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function AdminSignupScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessRegistration, setBusinessRegistration] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!fullName || !email || !businessName || !businessRegistration || !adminCode || !password) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (adminCode !== 'EXPRESSWAY2024') {
      Alert.alert('Invalid Code', 'The admin authorization code is incorrect');
      return;
    }
    
    setIsLoading(true);
    console.log('Creating admin account:', {
      fullName,
      email,
      businessName,
      businessRegistration,
    });

    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Application Submitted',
        'Your admin account request has been submitted. You will receive an email once your account is verified and approved.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/auth'),
          },
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Admin Registration',
          headerStyle: {
            backgroundColor: Colors.light.card,
          },
          headerTintColor: Colors.light.text,
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
            <View style={styles.iconContainer}>
              <Shield size={40} color="#8B5CF6" />
            </View>
            <Text style={styles.title}>Admin Registration</Text>
            <Text style={styles.subtitle}>
              Register your business to manage products and sales on Expressway
            </Text>
          </View>

          <View style={styles.warningBox}>
            <Shield size={20} color="#92400E" />
            <Text style={styles.warningText}>
              Admin accounts require verification. You&apos;ll need an authorization code to proceed.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <View style={styles.inputContainer}>
                  <User size={20} color={Colors.light.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Kofi Asante"
                    placeholderTextColor={Colors.light.textSecondary}
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email *</Text>
                <View style={styles.inputContainer}>
                  <Mail size={20} color={Colors.light.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="kofi@business.com"
                    placeholderTextColor={Colors.light.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Business Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Business Name *</Text>
                <View style={styles.inputContainer}>
                  <Building size={20} color={Colors.light.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Asante Enterprises"
                    placeholderTextColor={Colors.light.textSecondary}
                    value={businessName}
                    onChangeText={setBusinessName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Business Registration Number *</Text>
                <View style={styles.inputContainer}>
                  <Building size={20} color={Colors.light.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="CS123456789"
                    placeholderTextColor={Colors.light.textSecondary}
                    value={businessRegistration}
                    onChangeText={setBusinessRegistration}
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Security</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Admin Authorization Code *</Text>
                <View style={styles.inputContainer}>
                  <Shield size={20} color={Colors.light.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter authorization code"
                    placeholderTextColor={Colors.light.textSecondary}
                    value={adminCode}
                    onChangeText={setAdminCode}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password *</Text>
                <View style={styles.inputContainer}>
                  <Lock size={20} color={Colors.light.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={Colors.light.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password *</Text>
                <View style={styles.inputContainer}>
                  <Lock size={20} color={Colors.light.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={Colors.light.textSecondary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Submitting...' : 'Submit Application'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth')}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center' as const,
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center' as const,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  warningBox: {
    flexDirection: 'row' as const,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 20,
  },
  form: {
    gap: 20,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  inputContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
  button: {
    backgroundColor: '#8B5CF6',
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
  footer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#8B5CF6',
  },
});
