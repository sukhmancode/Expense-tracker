import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

const Register = ({navigation} : any) => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const Register = async() => {
        try {
            const response = await fetch("http://localhost:3000/register" , {
                method:'POST',
                headers:{'Content-Type' : 'application/json'},
                body: JSON.stringify({email,password})
            })
            const data = await response.json();
            if(response.ok) {
                Alert.alert("signup done,now log in");
                navigation.navigate("Login");   
            }else {
                Alert.alert("some error occured")
            }
        }
        catch(error) {
            console.log(error);
            Alert.alert('Error')
        }
    }
  return (
    <View>
    
    </View>
  )
}

export default Register

const styles = StyleSheet.create({})