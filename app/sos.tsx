import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Linking } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function SOSScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setSOSActive, setStatus, emergencyContacts } = useApp();
  const [countdown, setCountdown] = useState(3);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isActive) {
      setIsActive(true);
      startVibration();
    }
  }, [countdown, isActive]);

  const startVibration = () => {
    if (Platform.OS === 'android') {
      Vibration.vibrate([500, 500, 500, 500], true);
    } else {
      // iOS vibration pattern
      const vibrateInterval = setInterval(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 1000);
      return () => clearInterval(vibrateInterval);
    }
  };

  const handleCancel = () => {
    setCountdown(3);
    setIsActive(false);
    Vibration.cancel();
    router.back();
  };

  const handleStopSOS = () => {
    setSOSActive(false);
    setStatus('safe');
    Vibration.cancel();
    router.back();
  };

  const handleCallPolice = () => {
    Linking.openURL('tel:100');
  };

  const handleCallPrimaryContact = () => {
    const primaryContact = emergencyContacts[0];
    if (primaryContact) {
      Linking.openURL(`tel:${primaryContact.phone}`);
    } else {
      alert('No emergency contact set');
    }
  };

  if (!isActive) {
    // Countdown state
    return (
      <View style={[styles.container, styles.countdownContainer, { paddingTop: insets.top }]}>
        <Text style={styles.countdownText}>{countdown}</Text>
        <Text style={styles.countdownLabel}>SOS Activating in...</Text>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Active SOS state
  return (
    <View style={[styles.container, styles.activeContainer, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text style={styles.sosActiveText}>SOS ACTIVE</Text>
        <Text style={styles.helpText}>Help is on the way</Text>

        {/* Actions Sent */}
        <View style={styles.actionsList}>
          <View style={styles.actionItem}>
            <Ionicons name="checkmark-circle" size={24} color="#fff" style={styles.actionIcon} />
            <Text style={styles.actionText}>Message to Parents — Sent</Text>
          </View>
          <View style={styles.actionItem}>
            <Ionicons name="checkmark-circle" size={24} color="#fff" style={styles.actionIcon} />
            <Text style={styles.actionText}>Guardian Alert — Sent</Text>
          </View>
          <View style={styles.actionItem}>
            <Ionicons name="checkmark-circle" size={24} color="#fff" style={styles.actionIcon} />
            <Text style={styles.actionText}>Police Notification — Triggered</Text>
          </View>
          <View style={styles.actionItem}>
            <Ionicons name="checkmark-circle" size={24} color="#fff" style={styles.actionIcon} />
            <Text style={styles.actionText}>Live Location Sharing — ON</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={handleCallPolice}>
            <MaterialIcons name="local-police" size={24} color="#fff" style={styles.controlButtonIcon} />
            <Text style={styles.controlButtonText}>Call Police</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleCallPrimaryContact}>
            <Ionicons name="call" size={24} color="#fff" style={styles.controlButtonIcon} />
            <Text style={styles.controlButtonText}>Call Primary Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.stopButton]}
            onPress={handleStopSOS}>
            <Text style={styles.stopButtonText}>Stop SOS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  countdownContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 16,
  },
  countdownLabel: {
    fontSize: 24,
    color: '#666',
    marginBottom: 48,
  },
  cancelButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 18,
    color: '#111',
    fontWeight: '600',
  },
  activeContainer: {
    backgroundColor: '#FF3B30',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  sosActiveText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 4,
  },
  helpText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 48,
    opacity: 0.9,
  },
  actionsList: {
    marginBottom: 48,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 12,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  controls: {
    gap: 16,
  },
  controlButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonIcon: {
    marginRight: 12,
  },
  controlButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  stopButton: {
    backgroundColor: '#fff',
    marginTop: 8,
  },
  stopButtonText: {
    fontSize: 18,
    color: '#FF3B30',
    fontWeight: 'bold',
  },
});

