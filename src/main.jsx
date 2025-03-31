import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HashRouter } from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";
import { WalletProvider } from "./components/WalletProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WalletProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </WalletProvider>
  </StrictMode>
);
