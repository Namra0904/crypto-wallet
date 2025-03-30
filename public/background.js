let WALLET = undefined;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message:", message);

  if (message.type === "setWallet") {
    WALLET = message.WALLET;
    sendResponse({ success: true, WALLET });
  }

  if (message.type === "getWallet") {
    console.log("Background Wallet:", WALLET);
    sendResponse({ wallet: WALLET });
  }

  if (message.type === "PIED_PAYMENT_REQUEST") {
    console.log("Processing Payment Request:", message.message);

    // Simulate processing and send a response
    setTimeout(() => {
      sendResponse({ status: "success", details: "Payment Processed" });
    }, 1000);

    return true; // Required for async `sendResponse`
  }
});
