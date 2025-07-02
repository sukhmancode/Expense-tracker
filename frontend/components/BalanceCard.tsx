import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { styles } from '@/assets/styles/home.styles'
import { COLORS } from '@/constant/colors'

const BalanceCard = ({summary} : any) => {
  return (
    <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Total Balance</Text>
        <Text style={styles.balanceAmount} >{parseFloat(summary.balance).toFixed(2)}</Text>
        <View style={styles.balanceStats}>
            <View style={styles.balanceStatItem}>
                <Text>Income</Text>
                <Text style={[styles.balanceStatAmount, {color:COLORS.income}]}>
                    +${parseFloat(summary.income).toFixed(2)}
                </Text>
            </View>

                <View style={[styles.balanceStatItem,styles.statDivider]}/>
                <View style={styles.balanceStatItem}>
                    <Text style={styles.balanceStatLabel}>Expenses</Text>
                    <Text style={[styles.balanceStatAmount, {color:COLORS.expense}]}>
                    -${parseFloat(summary.expenses).toFixed(2)}
                </Text>
                </View>
        </View>
    </View>
  )
}

export default BalanceCard
