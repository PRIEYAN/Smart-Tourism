import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [backgroundTracking, setBackgroundTracking] = useState(true);
  const [autoSendSOS, setAutoSendSOS] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);

  const handleOpenPrivacyPolicy = () => {
    // TODO: Open privacy policy URL
    alert('Privacy Policy');
  };

  const handleOpenDataPolicy = () => {
    // TODO: Open data policy URL
    alert('Data Policy');
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Tracking Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tracking</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Enable Background Tracking</Text>
            <Text style={styles.settingDescription}>
              Allow location tracking when app is in background
            </Text>
          </View>
          <Switch
            value={backgroundTracking}
            onValueChange={(value) => {
              setBackgroundTracking(value);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            trackColor={{ false: '#E0E0E0', true: '#34C759' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Location Sharing Permissions</Text>
            <Text style={styles.settingDescription}>
              Control who can see your live location
            </Text>
          </View>
          <Switch
            value={locationSharing}
            onValueChange={(value) => {
              setLocationSharing(value);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            trackColor={{ false: '#E0E0E0', true: '#34C759' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* SOS Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SOS</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Auto-send SOS to Contacts</Text>
            <Text style={styles.settingDescription}>
              Automatically notify emergency contacts when SOS is activated
            </Text>
          </View>
          <Switch
            value={autoSendSOS}
            onValueChange={(value) => {
              setAutoSendSOS(value);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            trackColor={{ false: '#E0E0E0', true: '#34C759' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Notification Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive alerts and updates
            </Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={(value) => {
              setNotifications(value);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            trackColor={{ false: '#E0E0E0', true: '#34C759' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Privacy & Legal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Legal</Text>
        <TouchableOpacity
          style={styles.linkRow}
          onPress={handleOpenPrivacyPolicy}>
          <Text style={styles.linkText}>Privacy Policy</Text>
          <Text style={styles.linkArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkRow} onPress={handleOpenDataPolicy}>
          <Text style={styles.linkText}>Data Policy</Text>
          <Text style={styles.linkArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.appInfo}>Emergency SOS App</Text>
        <Text style={styles.appInfo}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  linkText: {
    fontSize: 16,
    color: '#007AFF',
  },
  linkArrow: {
    fontSize: 24,
    color: '#999',
  },
  appInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});

