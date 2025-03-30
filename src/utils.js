import { ethers, HDNodeWallet } from "ethers";

const sendMessageToExtension = async (message) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
};

async function encryptData(password, data) {
  const encoder = new TextEncoder();
  const encodedPassword = encoder.encode(password);

  // Derive a key from the password
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encodedPassword,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  // Convert data to Uint8Array and encrypt
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector
  const encryptedData = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encoder.encode(JSON.stringify(data))
  );

  // Return encrypted data as Base64 along with IV & salt
  return btoa(
    JSON.stringify({
      salt: Array.from(salt),
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encryptedData)),
    })
  );
}

async function decryptData(password, encryptedString) {
  const encoder = new TextEncoder();
  const encodedPassword = encoder.encode(password);
  const decoded = JSON.parse(atob(encryptedString));

  // Extract salt, IV, and encrypted data
  const salt = new Uint8Array(decoded.salt);
  const iv = new Uint8Array(decoded.iv);
  const encryptedData = new Uint8Array(decoded.data).buffer;

  // Derive the key again using the same password and salt
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encodedPassword,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  // Decrypt the data
  const decryptedData = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encryptedData
  );

  return JSON.parse(new TextDecoder().decode(decryptedData));
}

let WALLET = undefined;

const initWalletFromBackground = async () => {
  const wallet = await sendMessageToExtension({
    type: "getWallet",
  });

  if (!wallet.wallet) {
    return;
  }

  if (wallet.wallet) {
    WALLET = wallet.wallet;
    console.log("User already exists!", WALLET.wallet);
  }
};

const loadDecryptedWallet = (password) => {
  return new Promise((resolve, reject) => {
    decryptData(password, localStorage.getItem("wallet_details"))
      .then((val) => {
        WALLET = val;
        resolve(val);
      })
      .catch((val) => {
        reject(val);
      });
  });
};

const newWallet = (password) => {
  const entropy = ethers.randomBytes(16);
  const mnemonic = ethers.Mnemonic.fromEntropy(entropy).phrase;
  const wallet = HDNodeWallet.fromPhrase(mnemonic);
  const walletData = {
    mnemonic,
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey,
  };

  return new Promise((resolve, reject) => {
    encryptData(password, walletData)
      .then(async (encryptedData) => {
        localStorage.setItem("wallet_details", encryptedData);
        const wallet = await sendMessageToExtension({
          type: "setWallet",
          WALLET: walletData,
        });
        resolve(walletData.mnemonic);
      })
      .catch(reject);
  });
};

const initializePayment = (data) => {
  console.log("initialize payment", data);
};

const hasKey = () => !!WALLET;

export {
  sendMessageToExtension,
  newWallet,
  decryptData,
  encryptData,
  hasKey,
  initializePayment,
  loadDecryptedWallet,
  initWalletFromBackground,
};
