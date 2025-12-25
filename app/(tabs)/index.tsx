import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Vibration,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, status, setSOSActive, setTracking, setStatus } = useApp();
  const [isPressing, setIsPressing] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const getStatusColor = () => {
    switch (status) {
      case 'safe':
        return '#34C759';
      case 'tracking':
        return '#FF9500';
      case 'sos':
        return '#FF3B30';
      default:
        return '#34C759';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'safe':
        return 'Safe';
      case 'tracking':
        return 'Tracking enabled';
      case 'sos':
        return 'SOS Active';
      default:
        return 'Safe';
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleSOSPressIn = () => {
    setIsPressing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startPulseAnimation();

    pressTimer.current = setTimeout(() => {
      // 2-3 second hold
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSOSActive(true);
      setStatus('sos');
      router.push('/sos');
    }, 2500);
  };

  const handleSOSPressOut = () => {
    setIsPressing(false);
    pulseAnim.setValue(1);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleEnableTracking = () => {
    setTracking(true);
    setStatus('tracking');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleAlertFamily = () => {
    // TODO: Implement SMS/WhatsApp alert
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    alert('Family alert sent!');
  };

  const handleNotifyPolice = () => {
    // TODO: Implement police notification
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    alert('Police notified!');
  };

  const handleShareLiveLink = () => {
    // TODO: Implement share live location link
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    alert('Live location link copied!');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Center Section - SOS Button */}
      <View style={styles.centerSection}>
        <Animated.View
          style={[
            styles.sosButtonContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}>
          <TouchableOpacity
            style={[
              styles.sosButton,
              isPressing && styles.sosButtonPressed,
            ]}
            onPressIn={handleSOSPressIn}
            onPressOut={handleSOSPressOut}
            activeOpacity={0.9}>
            <Text style={styles.sosButtonText}>SOS</Text>
            {isPressing && (
              <Text style={styles.sosHintText}>Hold to activate...</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
        {!isPressing && (
          <Text style={styles.sosInstructionText}>
            Press & Hold for 2-3 seconds
          </Text>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleEnableTracking}>
          <Ionicons name="location" size={28} color="#007AFF" />
          <Text style={styles.actionText}>Enable Live{'\n'}Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleAlertFamily}>
          <Ionicons name="people" size={28} color="#007AFF" />
          <Text style={styles.actionText}>Alert{'\n'}Family</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleNotifyPolice}>
          <MaterialIcons name="local-police" size={28} color="#007AFF" />
          <Text style={styles.actionText}>Notify{'\n'}Police</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShareLiveLink}>
          <Ionicons name="share-social" size={28} color="#007AFF" />
          <Text style={styles.actionText}>Share Live{'\n'}Link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  sosButtonContainer: {
    marginBottom: 16,
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sosButtonPressed: {
    backgroundColor: '#CC2E24',
  },
  sosButtonText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  sosHintText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  sosInstructionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    fontSize: 12,
    color: '#111',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 8,
  },
});
