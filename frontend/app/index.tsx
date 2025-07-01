import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    setTimeout(() => {
    router.replace('/login');
      
    }, 50);
  }, []);

  return null;
}
