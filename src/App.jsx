import { ConfigProvider, theme } from "antd";
import AppRoutes from "./routes";
import { initializePayment, initWalletFromBackground } from "./services/utils";
import { useEffect } from "react";

function App() {
  initWalletFromBackground();

  useEffect(() => {
    const messageListener = (request, sender, sendResponse) => {
      if (request.type === "PIED_PAYMENT_REQUEST") {
        initializePayment(request.message.data);
      }
    };
    chrome.runtime.onMessage.addListener(messageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#1890ff",
        },
      }}
    >
      <AppRoutes />
    </ConfigProvider>
  );
}

export default App;
