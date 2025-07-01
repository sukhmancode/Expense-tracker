import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = ({navigation}:any) => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const login = async() => {
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
              });

              const data = await response.json();
              if(response.ok) {
                await AsyncStorage.setItem('jwtToken',data.token);
                navigation.reset({index:0,routes:[{name:'Home'}]})
              }else {
                Alert.alert("Something went wrong");
              }
        }
        catch(error) {
            console.log(error);
            Alert.alert(error as string)
        }
    }
  return (
    <View style={styles.container}>
        <Text>Email</Text>
        <TextInput style={styles.Input} value={email} onChangeText={setEmail} placeholder='enter your email'/>
        <Text>Password</Text>
        <TextInput style={styles.Input} value={password} onChangeText={setPassword} 
        placeholder='enter your password' secureTextEntry/>
        <Button title='Log in' onPress={login}/>
        <Text style={{ marginTop: 10 }} onPress={() => navigation.navigate('Signup')}>Don't have an account? Sign up</Text>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
        padding:20
    },Input : {
        borderWidth:1,
        marginBottom:20
    }
})