import {useCallback, useState} from "react";
import { Alert } from "react-native";
export const useTransactions = (userId: string | number) => {
    const API_URL = 'https://expensetracker-fvpo.onrender.com/api'
    const [transactions,setTransactions] = useState([]);
    const [summary,setSummary] = useState({
        balance:0,
        income:0,
        expenses:0
    });

    const [isLoading,setIsLoading] = useState(true);
    const fetchTransactions = useCallback(async () => {
        try {
            const response  = await fetch(`${API_URL}/transactions/${userId}`);
            const data = await response.json();
            setTransactions(data.transaction);
        }
        catch(error) {
            console.log(error);
        }
    },[userId])

    const fetchSummary = useCallback(async () => {
        try {
            const response  = await fetch(`${API_URL}/transactions/summary/${userId}`);
            const data = await response.json();
            setSummary(data);
        }
        catch(error) {
            console.log(error);
        }
    },[userId])


    const loadData = useCallback(async () => {
        if(!userId) {
            return;
        }
        setIsLoading(true);
        try {
            await Promise.all([fetchTransactions(),fetchSummary()]);
        }catch(error) {
            console.error("Error loading data",error);
        }
        finally {
            setIsLoading(false)
        }
    },[fetchTransactions,fetchSummary,userId])

    const deleteTransaction = async(id:number | string) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, {method:"DELETE"});
            if(!response.ok) {
                throw new Error("Failed to delete transaction");
                

            }
            loadData();
            Alert.alert("transaction deleted successfully");

        }catch(error) {
            console.error("error deleting transaction",error);
            Alert.alert("Error")
        }
    }

    return {transactions,summary,isLoading,loadData,deleteTransaction}
}