import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { Colors } from '@/constants/theme';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const router = useRouter();
  const { login } = useApp();

  const handleSendOTP = () => {
    if (phoneNumber.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }
    // Simulate OTP sending
    setOtpSent(true);
    Alert.alert('OTP Sent', 'Please check your phone for the OTP');
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP');
      return;
    }
    // Simulate OTP verification
    login(phoneNumber);
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    login('guest');
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>🆘</Text>
          </View>
          <Text style={styles.appName}>Emergency SOS</Text>
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            editable={!otpSent}
          />
          {!otpSent && (
            <TouchableOpacity style={styles.primaryButton} onPress={handleSendOTP}>
              <Text style={styles.primaryButtonText}>Send OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* OTP Input */}
        {otpSent && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="000000"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
            />
            <TouchableOpacity style={styles.primaryButton} onPress={handleVerifyOTP}>
              <Text style={styles.primaryButtonText}>Verify OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => {
                setOtpSent(false);
                setOtp('');
              }}>
              <Text style={styles.linkText}>Change Number</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Remember Device */}
        {otpSent && (
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setRememberDevice(!rememberDevice)}>
            <View style={[styles.checkbox, rememberDevice && styles.checkboxChecked]}>
              {rememberDevice && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Remember this device</Text>
          </TouchableOpacity>
        )}

        {/* Skip Option */}
        {!otpSent && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip & Continue as Guest</Text>
          </TouchableOpacity>
        )}

        {/* Security Note */}
        <Text style={styles.securityText}>
          Your data is secure & used only in emergencies
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 48,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  linkText: {
    color: '#FF3B30',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#999',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#111',
  },
  skipButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  skipText: {
    color: '#666',
    fontSize: 16,
  },
  securityText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 32,
  },
});

