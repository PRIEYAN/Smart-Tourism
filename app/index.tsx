import { Redirect } from 'expo-router';
import { useApp } from '@/contexts/AppContext';

export default function Index() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}

