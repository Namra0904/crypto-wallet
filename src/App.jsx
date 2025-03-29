import Onboarding from "./components/Recover";
import { ConfigProvider, theme } from "antd";
import AppRoutes from "./routes";
import SecureWallet from './components/NewWallet'

function App() {
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
      {/* <Onboarding /> */}
    </ConfigProvider>
  );
}

export default App;
