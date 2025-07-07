import {  Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {styles} from '@/assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constant/colors'
import { router } from 'expo-router'

const NoTransactions = () => {
  return (
    <View style={styles.container}>
        <Ionicons 
        name="receipt-outline"
        size={60}
        color={COLORS.textLight}
        style={styles.emptyStateIcon}/>

        <Text style={styles.emptyStateTitle}>No transactions yet</Text>
        <Text>
            Start Tracking now
        </Text>
        <TouchableOpacity style={styles.emptyStateButton} onPress={() => router.push("/create")}>
            <Ionicons name='add-circle' size={18} color={COLORS.white} />
            <Text>Add Transaction</Text>
        </TouchableOpacity>
    </View>
  )
}

export default NoTransactions
