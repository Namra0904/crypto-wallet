let WALLET = undefined;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "setWallet") {
    WALLET = message.WALLET;
    sendResponse({ success: true, WALLET });
  }

  if (message.type === "getWallet") {
    console.log("bakcgrund 10", WALLET);

    sendResponse({ wallet: WALLET });
  }
  console.log(message);

  // if (message.type === "PIED_PAYMENT_REQUEST") {
  //   console.log("In background of extension");
  //   sendResponse({});
  // }

  return true; // Only needed if handling async operations
});
