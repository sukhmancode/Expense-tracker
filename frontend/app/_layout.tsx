import { Stack, router } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StatusBar} from 'expo-status-bar'

export default function RootLayout() {
  useEffect(() => {
    const checkUser = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        router.replace('/about'); 
      } else {
        router.replace('/login'); 
      }
    };

    setTimeout(() => {
      checkUser();
    }, 50);
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="dark"/>
    </>
  );
}
