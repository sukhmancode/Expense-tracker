import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { styles } from '@/assets/styles/home.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constant/colors';
import { formatDate } from '@/lib/dateutils';

const Category_Icons = {
  Food_Drinks:"fast-food",
  Shopping:"cart",
  Transportation: "car",
  Entertainment:"film",
  Bills:"reciept",
  Income:"cash",
  Other:"ellipis-horizontal"
}


const TransactionsItem = ({item,onDelete}:any) => {

  const isIncome = parseFloat(item.amount) > 0;
  //@ts-ignore
  const iconName = Category_Icons[item.category] || "pricetag-outline"
  return (
   <View style={styles.transactionCard}>
  <View style={styles.categoryIconContainer}>
    <Ionicons name={iconName} size={22} color={isIncome ? COLORS.income : COLORS.expense} />
  </View>

  <View style={styles.transactionLeft}>
    <Text style={styles.transactionTitle}>{item.title}</Text>
    <Text style={styles.transactionCategory}>{item.category}</Text>
  </View>

  <View style={styles.transactionRight}>
    <Text style={[styles.transactionAmount, { color: isIncome ? COLORS.income : COLORS.expense }]}>
      {isIncome ? "+" : "-"}${Math.abs(parseFloat(item.amount)).toFixed(2)}
    </Text>
    <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
  </View>

  <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
    <Ionicons name='trash-outline' size={20} color={COLORS.expense} />
  </TouchableOpacity>
</View>

  )
}

export default TransactionsItem
