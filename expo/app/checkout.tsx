import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { CheckCircle, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useCart } from '@/contexts/cart';

type PaymentType = 'mobile_money' | 'card';
type MobileMoneyProvider = 'mtn' | 'vodafone' | 'airteltigo';

interface MobileMoneyMethod {
  id: MobileMoneyProvider;
  name: string;
  color: string;
  icon: string;
}

const mobileMoneyMethods: MobileMoneyMethod[] = [
  { id: 'mtn', name: 'MTN Mobile Money', color: '#FFCD00', icon: '📱' },
  { id: 'vodafone', name: 'Vodafone Cash', color: '#E60000', icon: '📱' },
  { id: 'airteltigo', name: 'AirtelTigo Money', color: '#ED1C24', icon: '📱' },
];

export default function CheckoutScreen() {
  const { cartTotal, clearCart } = useCart();
  const [paymentType, setPaymentType] = useState<PaymentType | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<MobileMoneyProvider | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!paymentType) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    if (paymentType === 'mobile_money') {
      if (!selectedMethod) {
        Alert.alert('Error', 'Please select a mobile money provider');
        return;
      }
      if (!phoneNumber || phoneNumber.length < 10) {
        Alert.alert('Error', 'Please enter a valid phone number');
        return;
      }
      console.log('Processing mobile money payment:', { selectedMethod, phoneNumber, amount: cartTotal });
    } else {
      if (!cardNumber || cardNumber.length < 16) {
        Alert.alert('Error', 'Please enter a valid card number');
        return;
      }
      if (!cardExpiry || !cardCVV || !cardName) {
        Alert.alert('Error', 'Please fill in all card details');
        return;
      }
      console.log('Processing card payment:', { cardNumber: cardNumber.slice(-4), amount: cartTotal });
    }
    
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      
      if (paymentType === 'mobile_money') {
        Alert.alert(
          'Payment Processing',
          `A prompt has been sent to ${phoneNumber}. Please approve the payment on your ${mobileMoneyMethods.find(m => m.id === selectedMethod)?.name} app.`,
          [
            {
              text: 'I\'ve approved',
              onPress: () => {
                Alert.alert(
                  'Payment Successful! 🎉',
                  'Your order has been placed successfully. You will receive a confirmation SMS shortly.',
                  [
                    {
                      text: 'Continue Shopping',
                      onPress: () => {
                        clearCart();
                        router.replace('/');
                      },
                    },
                  ]
                );
              },
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
      } else {
        Alert.alert(
          'Payment Successful! 🎉',
          'Your order has been placed successfully. You will receive a confirmation email shortly.',
          [
            {
              text: 'Continue Shopping',
              onPress: () => {
                clearCart();
                router.replace('/');
              },
            },
          ]
        );
      }
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'Checkout',
          headerBackTitle: 'Back',
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₵{cartTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>₵15.00</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₵{(cartTotal + 15).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          <Text style={styles.sectionSubtitle}>Choose how you want to pay</Text>
          
          <TouchableOpacity
            style={[
              styles.paymentTypeCard,
              paymentType === 'mobile_money' && styles.paymentCardSelected,
            ]}
            onPress={() => {
              setPaymentType('mobile_money');
              setSelectedMethod(null);
            }}
          >
            <View style={styles.paymentCardLeft}>
              <View style={[styles.methodIcon, { backgroundColor: '#4CAF50' + '20' }]}>
                <Text style={styles.iconEmoji}>📱</Text>
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>Mobile Money</Text>
                <Text style={styles.methodDescription}>Pay with MTN, Vodafone, or AirtelTigo</Text>
              </View>
            </View>
            {paymentType === 'mobile_money' ? (
              <CheckCircle size={24} color={Colors.light.primary} />
            ) : (
              <View style={styles.radioOuter}>
                <View style={styles.radioInner} />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentTypeCard,
              paymentType === 'card' && styles.paymentCardSelected,
            ]}
            onPress={() => {
              setPaymentType('card');
              setSelectedMethod(null);
            }}
          >
            <View style={styles.paymentCardLeft}>
              <View style={[styles.methodIcon, { backgroundColor: '#2196F3' + '20' }]}>
                <Text style={styles.iconEmoji}>💳</Text>
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>Credit/Debit Card</Text>
                <Text style={styles.methodDescription}>Pay with Visa, Mastercard, or Verve</Text>
              </View>
            </View>
            {paymentType === 'card' ? (
              <CheckCircle size={24} color={Colors.light.primary} />
            ) : (
              <View style={styles.radioOuter}>
                <View style={styles.radioInner} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {paymentType === 'mobile_money' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Provider</Text>
            {mobileMoneyMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentCard,
                  selectedMethod === method.id && styles.paymentCardSelected,
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <View style={styles.paymentCardLeft}>
                  <View 
                    style={[
                      styles.methodIcon, 
                      { backgroundColor: method.color + '20' }
                    ]}
                  >
                    <Text style={styles.iconEmoji}>{method.icon}</Text>
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodName}>{method.name}</Text>
                    <Text style={styles.methodDescription}>Pay with your mobile wallet</Text>
                  </View>
                </View>
                
                {selectedMethod === method.id ? (
                  <CheckCircle size={24} color={Colors.light.primary} />
                ) : (
                  <View style={styles.radioOuter}>
                    <View style={styles.radioInner} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {paymentType === 'mobile_money' && selectedMethod && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enter Mobile Money Number</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.countryCode}>+233</Text>
              <TextInput
                style={styles.input}
                placeholder="XX XXX XXXX"
                placeholderTextColor={Colors.light.textSecondary}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                maxLength={10}
              />
            </View>
            <Text style={styles.inputHint}>
              Enter the mobile number registered with {mobileMoneyMethods.find(m => m.id === selectedMethod)?.name}
            </Text>
          </View>
        )}

        {paymentType === 'card' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            
            <Text style={styles.inputLabel}>Card Number</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={Colors.light.textSecondary}
                keyboardType="number-pad"
                value={cardNumber}
                onChangeText={setCardNumber}
                maxLength={16}
              />
            </View>

            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor={Colors.light.textSecondary}
                value={cardName}
                onChangeText={setCardName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.cardRow}>
              <View style={styles.cardHalf}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor={Colors.light.textSecondary}
                    keyboardType="number-pad"
                    value={cardExpiry}
                    onChangeText={setCardExpiry}
                    maxLength={5}
                  />
                </View>
              </View>

              <View style={styles.cardHalf}>
                <Text style={styles.inputLabel}>CVV</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor={Colors.light.textSecondary}
                    keyboardType="number-pad"
                    value={cardCVV}
                    onChangeText={setCardCVV}
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.securityNote}>
          <Text style={styles.securityText}>
            🔒 Your payment is secured with end-to-end encryption
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.payButton,
            (!paymentType || isProcessing || 
              (paymentType === 'mobile_money' && (!selectedMethod || !phoneNumber)) ||
              (paymentType === 'card' && (!cardNumber || !cardExpiry || !cardCVV || !cardName))
            ) && styles.payButtonDisabled,
          ]}
          onPress={handlePayment}
          disabled={!paymentType || isProcessing || 
            (paymentType === 'mobile_money' && (!selectedMethod || !phoneNumber)) ||
            (paymentType === 'card' && (!cardNumber || !cardExpiry || !cardCVV || !cardName))
          }
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.payButtonText}>
                Pay ₵{(cartTotal + 15).toFixed(2)}
              </Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </>
          )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
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
  summaryCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  summaryRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  paymentTypeCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  paymentCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors.light.border,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  paymentCardSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '08',
  },
  paymentCardLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 24,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
  inputHint: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginLeft: 4,
  },
  securityNote: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center' as const,
  },
  securityText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center' as const,
  },
  footer: {
    backgroundColor: Colors.light.card,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  payButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  payButtonDisabled: {
    backgroundColor: Colors.light.textSecondary,
    opacity: 0.5,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700' as const,
    marginRight: 8,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
    marginTop: 4,
  },
  cardRow: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  cardHalf: {
    flex: 1,
  },
});
