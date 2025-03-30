import { ethers, HDNodeWallet } from "ethers";

async function deriveKey(password, salt = "default_salt") {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode(salt),
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

async function encryptData(password, data) {
    const key = await deriveKey(password);
    const iv = crypto.getRandomValues(new Uint8Array(12)); 
    const encodedData = new TextEncoder().encode(JSON.stringify(data));
    const encryptedData = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encodedData
    );
    return { iv: Array.from(iv), encryptedData: Array.from(new Uint8Array(encryptedData)) };
}

async function decryptData(password, encryptedObject) {
    const { iv, encryptedData } = encryptedObject;
    const key = await deriveKey(password);
    const decryptedData = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(iv) },
        key,
        new Uint8Array(encryptedData)
    );
    return JSON.parse(new TextDecoder().decode(decryptedData));
}

async function storeEncryptedWallet(encryptedObject) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("WalletDB", 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("wallets")) {
                db.createObjectStore("wallets", { keyPath: "id" });
            }
        };
        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction("wallets", "readwrite");
            tx.objectStore("wallets").put({ id: "user_wallet", data: encryptedObject });
            tx.oncomplete = () => resolve();
        };
        request.onerror = () => reject(request.error);
    });
}

async function getEncryptedWallet() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("WalletDB", 1);
        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction("wallets", "readonly");
            const store = tx.objectStore("wallets");
            const req = store.get("user_wallet");
            req.onsuccess = () => resolve(req.result?.data || null);
            req.onerror = () => reject(req.error);
        };
        request.onerror = () => reject(request.error);
    });
}

async function generateEncryptedWallet(password) {
    const entropy = ethers.randomBytes(16); 
    const mnemonic = ethers.Mnemonic.fromEntropy(entropy).phrase;
    console.log(mnemonic);

    const wallet = HDNodeWallet.fromPhrase(mnemonic);
    console.log(wallet);

    const walletData = { mnemonic, privateKey: wallet.privateKey, publicKey: wallet.publicKey };

    const encryptedWallet = await encryptData(password, walletData);
    await storeEncryptedWallet(encryptedWallet);
    return encryptedWallet;
}

async function decryptWallet(password) {
    const encryptedWallet = await getEncryptedWallet();
    if (!encryptedWallet) throw new Error("No encrypted wallet found");
    return await decryptData(password, encryptedWallet);
}


export {generateEncryptedWallet, decryptWallet}