import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { isAuthenticated } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    } else {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#FF3B30" />
    </View>
  );
}

