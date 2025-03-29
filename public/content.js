(function () {
  window.ethereum = {
    request: async ({ method }) => {
      if (method === "eth_requestAccounts") {
        return new Promise((resolve) => {
          chrome.storage.local.get("wallet", (data) => {
            resolve([data.wallet?.address]);
          });
        });
      }
    },
  };
  console.log("Injected Ethereum Provider!");
})();
