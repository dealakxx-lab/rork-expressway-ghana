import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Truck, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import Colors from '@/constants/colors';

interface DocumentState {
  uri: string | null;
  name: string | null;
  uploaded: boolean;
}

export default function DriverSignupScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ghanaCardNumber, setGhanaCardNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  
  const [driverLicense, setDriverLicense] = useState<DocumentState>({
    uri: null,
    name: null,
    uploaded: false,
  });
  
  const [insurance, setInsurance] = useState<DocumentState>({
    uri: null,
    name: null,
    uploaded: false,
  });
  
  const [ghanaCard, setGhanaCard] = useState<DocumentState>({
    uri: null,
    name: null,
    uploaded: false,
  });

  const pickDocument = async (type: 'license' | 'insurance' | 'card') => {
    console.log('Picking document for:', type);
    
    if (Platform.OS === 'web') {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: ['image/*', 'application/pdf'],
          copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
          const asset = result.assets[0];
          const doc: DocumentState = {
            uri: asset.uri,
            name: asset.name,
            uploaded: true,
          };

          if (type === 'license') setDriverLicense(doc);
          if (type === 'insurance') setInsurance(doc);
          if (type === 'card') setGhanaCard(doc);
          
          console.log('Document picked:', asset.name);
        }
      } catch (error) {
        console.error('Error picking document:', error);
        Alert.alert('Error', 'Failed to pick document');
      }
    } else {
      Alert.alert(
        'Upload Document',
        'Choose document source',
        [
          {
            text: 'Camera',
            onPress: async () => {
              const permission = await ImagePicker.requestCameraPermissionsAsync();
              if (!permission.granted) {
                Alert.alert('Permission Required', 'Camera permission is needed to take photos');
                return;
              }

              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: 'images' as ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
              });

              if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                const doc: DocumentState = {
                  uri: asset.uri,
                  name: `${type}_${Date.now()}.jpg`,
                  uploaded: true,
                };

                if (type === 'license') setDriverLicense(doc);
                if (type === 'insurance') setInsurance(doc);
                if (type === 'card') setGhanaCard(doc);
                
                console.log('Photo captured');
              }
            },
          },
          {
            text: 'Gallery',
            onPress: async () => {
              const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (!permission.granted) {
                Alert.alert('Permission Required', 'Gallery permission is needed to select photos');
                return;
              }

              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images' as ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
              });

              if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                const doc: DocumentState = {
                  uri: asset.uri,
                  name: `${type}_${Date.now()}.jpg`,
                  uploaded: true,
                };

                if (type === 'license') setDriverLicense(doc);
                if (type === 'insurance') setInsurance(doc);
                if (type === 'card') setGhanaCard(doc);
                
                console.log('Image selected from gallery');
              }
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !email || !phone || !ghanaCardNumber || !licenseNumber || !vehicleType || !vehicleNumber) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    if (!driverLicense.uploaded || !insurance.uploaded || !ghanaCard.uploaded) {
      Alert.alert('Missing Documents', 'Please upload all required documents');
      return;
    }

    setIsLoading(true);
    console.log('Submitting driver application:', {
      fullName,
      email,
      phone,
      ghanaCardNumber,
      licenseNumber,
      vehicleType,
      vehicleNumber,
    });

    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Application Submitted',
        'Your driver application has been submitted successfully. You will be notified once your documents are reviewed.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/'),
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
          title: 'Driver Signup',
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
              <Truck size={40} color={Colors.light.primary} />
            </View>
            <Text style={styles.title}>Become a Driver</Text>
            <Text style={styles.subtitle}>
              Join Expressway as a delivery driver and start earning today
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Kwame Mensah"
                placeholderTextColor={Colors.light.textSecondary}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="kwame@example.com"
                placeholderTextColor={Colors.light.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="+233 24 123 4567"
                placeholderTextColor={Colors.light.textSecondary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ghana Card Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="GHA-123456789-0"
                placeholderTextColor={Colors.light.textSecondary}
                value={ghanaCardNumber}
                onChangeText={setGhanaCardNumber}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Driver Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Driver License Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="DL1234567"
                placeholderTextColor={Colors.light.textSecondary}
                value={licenseNumber}
                onChangeText={setLicenseNumber}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vehicle Type *</Text>
              <TextInput
                style={styles.input}
                placeholder="Motorcycle / Car / Van"
                placeholderTextColor={Colors.light.textSecondary}
                value={vehicleType}
                onChangeText={setVehicleType}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vehicle Registration Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="GR 1234-21"
                placeholderTextColor={Colors.light.textSecondary}
                value={vehicleNumber}
                onChangeText={setVehicleNumber}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Required Documents</Text>
            <Text style={styles.sectionSubtitle}>
              Upload clear photos or scans of your documents
            </Text>

            <TouchableOpacity 
              style={styles.documentCard}
              onPress={() => pickDocument('license')}
            >
              <View style={styles.documentIcon}>
                <FileText size={24} color={driverLicense.uploaded ? Colors.light.success : Colors.light.primary} />
              </View>
              <View style={styles.documentInfo}>
                <Text style={styles.documentTitle}>Driver&apos;s License *</Text>
                {driverLicense.uploaded ? (
                  <Text style={styles.documentUploaded}>{driverLicense.name}</Text>
                ) : (
                  <Text style={styles.documentDescription}>Tap to upload</Text>
                )}
              </View>
              {driverLicense.uploaded ? (
                <CheckCircle size={24} color={Colors.light.success} />
              ) : (
                <Upload size={24} color={Colors.light.textSecondary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.documentCard}
              onPress={() => pickDocument('insurance')}
            >
              <View style={styles.documentIcon}>
                <FileText size={24} color={insurance.uploaded ? Colors.light.success : Colors.light.primary} />
              </View>
              <View style={styles.documentInfo}>
                <Text style={styles.documentTitle}>Vehicle Insurance *</Text>
                {insurance.uploaded ? (
                  <Text style={styles.documentUploaded}>{insurance.name}</Text>
                ) : (
                  <Text style={styles.documentDescription}>Tap to upload</Text>
                )}
              </View>
              {insurance.uploaded ? (
                <CheckCircle size={24} color={Colors.light.success} />
              ) : (
                <Upload size={24} color={Colors.light.textSecondary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.documentCard}
              onPress={() => pickDocument('card')}
            >
              <View style={styles.documentIcon}>
                <FileText size={24} color={ghanaCard.uploaded ? Colors.light.success : Colors.light.primary} />
              </View>
              <View style={styles.documentInfo}>
                <Text style={styles.documentTitle}>Ghana Card *</Text>
                {ghanaCard.uploaded ? (
                  <Text style={styles.documentUploaded}>{ghanaCard.name}</Text>
                ) : (
                  <Text style={styles.documentDescription}>Tap to upload</Text>
                )}
              </View>
              {ghanaCard.uploaded ? (
                <CheckCircle size={24} color={Colors.light.success} />
              ) : (
                <Upload size={24} color={Colors.light.textSecondary} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <AlertCircle size={20} color={Colors.light.secondary} />
            <Text style={styles.infoText}>
              Your documents will be reviewed within 1-2 business days. You&apos;ll receive an email once your application is approved.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Submitting Application...' : 'Submit Application'}
            </Text>
          </TouchableOpacity>
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
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center' as const,
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.light.primary,
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
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
  documentCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  documentDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  documentUploaded: {
    fontSize: 12,
    color: Colors.light.success,
    fontWeight: '500' as const,
  },
  infoBox: {
    flexDirection: 'row' as const,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center' as const,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
