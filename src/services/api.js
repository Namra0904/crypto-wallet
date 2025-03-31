import axios from "axios";

const BASE_URL = "https://piedwalletprod.vercel.app";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

export const getGraphData = async(address) => {
    try {
        const response = await axiosInstance.get(`/graph-data/${address}}`);
        console.log('transactions', response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching details:", error);
        return null;
    }
}

export const getTransactions = async (address) => {
    try {
        const response = await axiosInstance.get(`/transactions/${address}`);
        console.log('transactions', response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching details:", error);
        return null;
    }
};

export const getWalletBalance = async (address) => {
    try {
        const response = await axiosInstance.get(`/balance/${address}`);
        console.log('balance', response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching wallet balance:", error);
        return null;
    }
};

export const sendTransaction = async (to, amount, privateKey) => {
    const transactionData = { to, amount, privateKey };
    try {
        const response = await axiosInstance.post("/send-transaction", transactionData);
        return response.data;
    } catch (error) {
        console.error("Error creating transaction:", error);
        return null;
    }
};
