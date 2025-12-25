import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { Linking } from 'react-native';

export default function TrackingScreen() {
  const insets = useSafeAreaInsets();
  const { isTracking, setTracking, setStatus } = useApp();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'ON' | 'OFF'>('ON');
  const [internetStatus, setInternetStatus] = useState<'ON' | 'OFF'>('ON');
  const [backgroundMode, setBackgroundMode] = useState<'ON' | 'OFF'>('ON');

  useEffect(() => {
    if (isTracking) {
      startLocationTracking();
    }
    return () => {
      if (isTracking) {
        stopLocationTracking();
      }
    };
  }, [isTracking]);

  const startLocationTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === 'granted') {
        setBackgroundMode('ON');
      }

      // Start watching position
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );

      // Get initial location
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const stopLocationTracking = () => {
    setTracking(false);
    setStatus('safe');
    setLocation(null);
  };

  const handleShareLink = () => {
    if (location) {
      const link = `https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;
      // TODO: Implement share functionality
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      alert(`Location link: ${link}`);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>You are being tracked</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
      </View>

      {/* Map View Placeholder */}
      <View style={styles.mapContainer}>
        {location ? (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapIcon}>🗺️</Text>
            <Text style={styles.mapText}>Map View</Text>
            <Text style={styles.coordinatesText}>
              {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
            </Text>
            <View style={styles.locationMarker}>
              <View style={styles.markerDot} />
            </View>
          </View>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapIcon}>📍</Text>
            <Text style={styles.mapText}>Getting location...</Text>
          </View>
        )}

        {/* Time & Battery Indicator */}
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>
            {new Date().toLocaleTimeString()} • 🔋 85%
          </Text>
        </View>
      </View>

      {/* Status Chips */}
      <ScrollView style={styles.statusSection}>
        <View style={styles.statusChips}>
          <View style={[styles.chip, gpsStatus === 'ON' && styles.chipActive]}>
            <View style={[styles.chipDot, gpsStatus === 'ON' && styles.chipDotActive]} />
            <Text style={styles.chipText}>GPS — {gpsStatus}</Text>
          </View>

          <View style={[styles.chip, internetStatus === 'ON' && styles.chipActive]}>
            <View style={[styles.chipDot, internetStatus === 'ON' && styles.chipDotActive]} />
            <Text style={styles.chipText}>Internet — {internetStatus}</Text>
          </View>

          <View style={[styles.chip, backgroundMode === 'ON' && styles.chipActive]}>
            <View style={[styles.chipDot, backgroundMode === 'ON' && styles.chipDotActive]} />
            <Text style={styles.chipText}>Background Mode — {backgroundMode}</Text>
          </View>
        </View>

        {/* Movement Trail Info */}
        {location && (
          <View style={styles.trailInfo}>
            <Text style={styles.trailTitle}>Movement Trail</Text>
            <Text style={styles.trailText}>
              Tracking your path since {new Date().toLocaleTimeString()}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShareLink}>
          <Text style={styles.shareButtonIcon}>📡</Text>
          <Text style={styles.shareButtonText}>Share Live Location Link</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.stopButton} onPress={stopLocationTracking}>
          <Text style={styles.stopButtonText}>Stop Tracking</Text>
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
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D0D0D0',
  },
  mapIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  mapText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  coordinatesText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  locationMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  markerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    borderWidth: 3,
    borderColor: '#fff',
  },
  infoBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  infoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  statusSection: {
    paddingHorizontal: 20,
  },
  statusChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipActive: {
    borderColor: '#34C759',
    backgroundColor: '#F0FDF4',
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
    marginRight: 8,
  },
  chipDotActive: {
    backgroundColor: '#34C759',
  },
  chipText: {
    fontSize: 14,
    color: '#111',
    fontWeight: '500',
  },
  trailInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  trailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  trailText: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  shareButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

