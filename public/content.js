window.addEventListener("message", (event) => {
  if (
    event.source !== window ||
    !event.data ||
    event.data.type !== "PIED_PAYMENT_REQUEST"
  ) {
    return;
  }

  chrome.runtime.sendMessage({
    type: "PIED_PAYMENT_REQUEST",
    message: event.data.payload,
  });
});
