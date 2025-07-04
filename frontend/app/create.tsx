import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '@/assets/styles/create.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constant/colors';
import { router } from 'expo-router';

const Create = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isExpense, setIsExpense] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const Categories = [
    { name: "Food_Drinks", icon: "fast-food" },
    { name: "Shopping", icon: "cart" },
    { name: "Transportation", icon: "car" },
    { name: "Entertainment", icon: "film" },
    { name: "Bills", icon: "receipt" }, // typo fixed from "reciept"
    { name: "Income", icon: "cash" },
    { name: "Other", icon: "ellipsis-horizontal" } // typo fixed from "ellipis"
  ];
  

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);
      console.log(userId);
      
    };
    fetchUserId();
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) {
      return Alert.alert("Error", "Please enter the title");
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return Alert.alert("Error", "Please enter a valid amount");
    }
    if (!selectedCategory) {
      return Alert.alert("Error", "Please select a category");
    }
    if (!userId) {
      return Alert.alert("Error", "User ID not found");
    }

    setIsLoading(true);
    try {
      const isFormatted = isExpense ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));
      const response = await fetch("https://expensetracker-fvpo.onrender.com/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id:userId,
          title,
          amount: isFormatted,
          category: selectedCategory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Failed to create transaction");
      }

      Alert.alert("Success", "Transaction created successfully");
      router.push("/about")
    } catch (error) {
      Alert.alert("Error", "Transaction not created");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name='arrow-back' size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>New Transaction</Text>
        <TouchableOpacity
          style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          <Text style={styles.saveButton}>{isLoading ? "Saving" : "Save"}</Text>
          {!isLoading && <Ionicons name='checkmark' size={18} color={COLORS.primary} />}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.typeSelector}>
            <TouchableOpacity style={[styles.typeButton,isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(true)}>
              <Ionicons 
              name='arrow-down-circle'
              size={22}
              color={isExpense ? COLORS.white : COLORS.expense}/>
              <Text style={[styles.typeButtonText,isExpense && styles.typeButtonTextActive]}>Expense</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.typeButton,!isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(false)}>
              <Ionicons 
              name='arrow-up-circle'
              size={22}
              color={!isExpense ? COLORS.white : COLORS.income}/>
              <Text style={[styles.typeButtonText,!isExpense && styles.typeButtonTextActive]}>Income</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.amountContainer}> 
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput 
          style={styles.amountInput}
          placeholder='0.00'
          placeholderTextColor={COLORS.textLight}
          value={amount}
          onChangeText={setAmount}
          keyboardType='numeric'>

          </TextInput>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons 
          name='create-outline'
          size={22}
          color={COLORS.textLight}
          style={styles.inputIcon}/>

          <TextInput 
          placeholder='Transaction title'
          onChangeText={setTitle}
          value={title}
          style={styles.input}/>
        </View>

        <Text style={styles.sectionTitle}>
          <Ionicons name='pricetag-outline' size={16} color={COLORS.text}/> Category
        </Text>



        <View style={styles.categoryGrid}>
          {(Categories).map((category) => (
            <TouchableOpacity 
            key={category.name}
            style={[styles.categoryButton,selectedCategory === category.name && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory(category.name)}>
            
              <Ionicons 
              //@ts-ignore
              name={category.icon}
              size={20} 
              color={selectedCategory === category.name ? COLORS.white : COLORS.text}/>
              <Text 
              style={[styles.categoryButtonText,selectedCategory === category.name && styles.categoryButtonTextActive]}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Create;
