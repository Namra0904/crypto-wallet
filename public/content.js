window.addEventListener("message", (event) => {
  if (event.source !== window || !event.data) return;

  if (event.data.type === "PIED_PAYMENT_REQUEST") {
    chrome.runtime.sendMessage(
      {
        type: "PIED_PAYMENT_REQUEST",
        message: event.data.payload,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Extension error:", chrome.runtime.lastError);
          return;
        }

        // Send response back to web app
        window.postMessage(
          { type: "PIED_PAYMENT_RESPONSE", payload: response },
          "*"
        );
      }
    );
  }
});
