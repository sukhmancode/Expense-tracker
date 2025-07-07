import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/constant/colors';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch("https://expensetracker-fvpo.onrender.com/auth/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Signup successful", "Now log in");
        router.push('/login'); // expo-router navigation
      } else {
        Alert.alert("Error", data.message || "Signup failed");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
        <Image style={styles.Logo}
         source={require("@/assets/images/logo-main.png")}/>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <View style={styles.newcontainer}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/login")} >
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, paddingTop: 150,
    paddingInline:20, justifyContent: 'center', 
   
  },
  newcontainer: {
    flexDirection:"row",
    flex: 1, padding: 10, justifyContent: 'center',
   
  },
  loginText: {
    color:"blue"
  },
  input: {
    borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5,
  },
  title: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center',
  },
  Logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius:20,
    marginBottom: 30,
 },
 button: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
