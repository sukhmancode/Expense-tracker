import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useTransactions } from '@/hooks/useTransactions';

export default function HomeScreen() {

  const [userId,setUserId] = useState<string  | null> ("");
  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(userId || '');
  
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      if(id) {
        setUserId(id)
      }else {
        router.replace("/(auth)/login")
      }
    }
    fetchUserId();
    
  },[])
  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);
  console.log(userId);

  console.log(summary);
  
  
  const logout = async () => {
    await AsyncStorage.removeItem('jwtToken');
    router.replace("/login")
  };
  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome to the Home screen!</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
