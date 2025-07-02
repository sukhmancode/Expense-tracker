import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useTransactions } from '@/hooks/useTransactions';
import PageLoader from '@/components/PageLoader';

export default function HomeScreen() {

  const [userId,setUserId] = useState<string  | null> ("");
  const [userEmail,setUserEmail] = useState<string  | null> ("");
  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(userId || '');
  
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      const email = await AsyncStorage.getItem('userEmail')
      if(id) {
        setUserId(id)
        setUserEmail(email)
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

  if(isLoading) {
    return <PageLoader/>
  }
  return (
    <View style={{ padding: 20 }}>
      <Text>{userId }</Text>
      <Text>{userEmail }</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
