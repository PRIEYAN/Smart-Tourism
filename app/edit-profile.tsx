import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useApp();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    bloodGroup: user?.bloodGroup || '',
    homeAddress: user?.homeAddress || '',
    allergies: user?.allergies?.join(', ') || '',
    conditions: user?.conditions?.join(', ') || '',
  });

  const handleSave = () => {
    updateProfile({
      name: formData.name,
      age: formData.age,
      bloodGroup: formData.bloodGroup,
      homeAddress: formData.homeAddress,
      allergies: formData.allergies
        ? formData.allergies.split(',').map((a) => a.trim())
        : [],
      conditions: formData.conditions
        ? formData.conditions.split(',').map((c) => c.trim())
        : [],
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter your name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
            placeholder="Enter your age"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Blood Group</Text>
          <TextInput
            style={styles.input}
            value={formData.bloodGroup}
            onChangeText={(text) => setFormData({ ...formData, bloodGroup: text })}
            placeholder="e.g., O+, A-, B+"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Home Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.homeAddress}
            onChangeText={(text) => setFormData({ ...formData, homeAddress: text })}
            placeholder="Enter your home address"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Allergies (comma separated)</Text>
          <TextInput
            style={styles.input}
            value={formData.allergies}
            onChangeText={(text) => setFormData({ ...formData, allergies: text })}
            placeholder="e.g., Peanuts, Shellfish"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Medical Conditions (comma separated)</Text>
          <TextInput
            style={styles.input}
            value={formData.conditions}
            onChangeText={(text) => setFormData({ ...formData, conditions: text })}
            placeholder="e.g., Diabetes, Hypertension"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
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
  form: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

