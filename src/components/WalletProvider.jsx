import React, { createContext, useContext, useState, useEffect } from "react";
import {
    newWallet,
    loadDecryptedWallet,
    hasKey,
    initWalletFromBackground,
    lockWallet,
    getWalletDetails,
} from "../services/utils"; // Import your wallet functions
import { useNavigate } from "react-router-dom";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [wallet, setWallet] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (hasKey()) {
            const password = prompt("Enter your password to unlock wallet");
            loadDecryptedWallet(password)
                .then(setWallet)
                .catch(() => console.log("Failed to load wallet"));
            // navigate('/login')
        } else {
            initWalletFromBackground().then(setWallet);
        }
    }, []);

    const createNewWallet = async (password) => {
        const mnemonic = await newWallet(password);
        const walletDetails = getWalletDetails();
        setWallet(walletDetails);
        return mnemonic;
    };

    const unlockWallet = async (password) => {
        try {
            const decryptedWallet = await loadDecryptedWallet(password);
            setWallet(decryptedWallet);
        } catch (error) {
            console.error("Failed to decrypt wallet", error);
        }
    };

    const lockCurrentWallet = () => {
        lockWallet();
        setWallet(null);
    };

    return (
        <WalletContext.Provider
            value={{ wallet, createNewWallet, unlockWallet, lockCurrentWallet, setWallet }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    return useContext(WalletContext);
};
