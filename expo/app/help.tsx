import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Mail, Phone, FileText, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function HelpScreen() {
  const handleContactPress = (type: 'email' | 'phone' | 'chat') => {
    if (type === 'email') {
      Linking.openURL('mailto:support@example.com');
    } else if (type === 'phone') {
      Linking.openURL('tel:+233000000000');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'Help & Support',
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
        }} 
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          
          <TouchableOpacity 
            style={styles.helpItem}
            onPress={() => handleContactPress('chat')}
          >
            <View style={styles.helpLeft}>
              <View style={styles.iconContainer}>
                <MessageCircle size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.helpTextContainer}>
                <Text style={styles.helpTitle}>Live Chat</Text>
                <Text style={styles.helpSubtitle}>Chat with our support team</Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.helpItem}
            onPress={() => handleContactPress('email')}
          >
            <View style={styles.helpLeft}>
              <View style={styles.iconContainer}>
                <Mail size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.helpTextContainer}>
                <Text style={styles.helpTitle}>Email Support</Text>
                <Text style={styles.helpSubtitle}>support@example.com</Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.helpItem}
            onPress={() => handleContactPress('phone')}
          >
            <View style={styles.helpLeft}>
              <View style={styles.iconContainer}>
                <Phone size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.helpTextContainer}>
                <Text style={styles.helpTitle}>Phone Support</Text>
                <Text style={styles.helpSubtitle}>+233 00 000 0000</Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          
          <TouchableOpacity style={styles.helpItem}>
            <View style={styles.helpLeft}>
              <View style={styles.iconContainer}>
                <FileText size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.helpTextContainer}>
                <Text style={styles.helpTitle}>FAQ</Text>
                <Text style={styles.helpSubtitle}>Frequently asked questions</Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpItem}>
            <View style={styles.helpLeft}>
              <View style={styles.iconContainer}>
                <FileText size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.helpTextContainer}>
                <Text style={styles.helpTitle}>Terms & Conditions</Text>
                <Text style={styles.helpSubtitle}>Read our terms</Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpItem}>
            <View style={styles.helpLeft}>
              <View style={styles.iconContainer}>
                <FileText size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.helpTextContainer}>
                <Text style={styles.helpTitle}>Privacy Policy</Text>
                <Text style={styles.helpSubtitle}>How we protect your data</Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        </View>
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
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  helpItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    backgroundColor: Colors.light.card,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  helpLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  helpSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
});
