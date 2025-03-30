let decryptedWallet = null; // Store decrypted wallet only in memory
let walletUnlocked = false; // Track wallet state

// Function to store decrypted wallet in memory
function storeDecryptedWallet(walletData) {
  decryptedWallet = walletData;
  walletUnlocked = true;
}

// Function to clear wallet from memory (Logout/Lock)
function lockWallet() {
  decryptedWallet = null;
  walletUnlocked = false;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "unlockWallet") {
    // Decrypt wallet using the provided password
    decryptWallet(request.password)
      .then(wallet => {
        storeDecryptedWallet(wallet);
        sendResponse({ success: true });
      })
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // Required for async response
  }

  if (request.action === "getWallet") {
    if (walletUnlocked && decryptedWallet) {
      sendResponse({ success: true, wallet: decryptedWallet });
    } else {
      sendResponse({ success: false, error: "Wallet is locked" });
    }
  }

  if (request.action === "lockWallet") {
    lockWallet();
    sendResponse({ success: true });
  }
});
