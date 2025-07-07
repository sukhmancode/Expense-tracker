import React, { useEffect, useState } from 'react';
import { View, Text,Image, TouchableOpacity, Alert, FlatList, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useTransactions } from '@/hooks/useTransactions';
import PageLoader from '@/components/PageLoader';
import { styles } from '@/assets/styles/home.styles';
import { Ionicons} from '@expo/vector-icons'
import { COLORS } from '@/constant/colors';
import BalanceCard from '@/components/BalanceCard';
import TransactionsItem from '@/components/TransactionsItem';
import NoTransactions from '@/components/NoTransactions';

export default function HomeScreen() {

  const [userId,setUserId] = useState<string  | null> ("");
  const [userEmail,setUserEmail] = useState<string  | null> ("");
  const [refreshing,setRefreshing] = useState(false)
  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(userId || '');
  
  const onRefresh = async() => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false)
  }
  
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
  }, [userId,loadData])
  
  const logout = async () => {
    Alert.alert("Logout" , "Are you sure about that!", [
      {text:"Cancel",style:"cancel"},
       {text:"Logout",style:"destructive",onPress:async() => {
        await AsyncStorage.removeItem('jwtToken')
        router.replace("/login")
       }
      }
    ])

  };

  const handleDelete = (id:number | string) => {
    Alert.alert("Delete Transaction", "Are you sure about that", [
      {text:"Cancel",style:"cancel"},
      {text:"Delete",style:"destructive",onPress:() => deleteTransaction(id)}
    ])
  }
  if(isLoading) {
    return <PageLoader/>
  }
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
              source={require("@/assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode='contain'/>
                <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.usernameText}>
              {userEmail}
            </Text>
          </View>
          </View>

          <View style={styles.header}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Ionicons name='add' size={20} color={"#fff"}/>
              <Text style={styles.addButtonText}> Add</Text>
            </TouchableOpacity>  

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Ionicons name='log-out-outline' size={22 } color={COLORS.text}></Ionicons>
            </TouchableOpacity>
          </View>        
        </View>
        
      
      <BalanceCard summary={summary}/>
      </View>

      <FlatList contentContainerStyle={styles.transactionsList}
      data={transactions}
      renderItem={({item}) => (
        <TransactionsItem item={item} onDelete = {handleDelete}/>
        
      ) }
      ListEmptyComponent={<NoTransactions/>}
      showsVerticalScrollIndicator={true}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}/>
    </View>
  );
}
