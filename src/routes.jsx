import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { hasKey } from "./services/utils";
import { Navigate } from "react-router-dom";

const Onboarding = lazy(() => import("./components/Onboarding"));
const Privacy = lazy(() => import("./components/Privacy"));
const Recover = lazy(() => import("./components/Recover"));
const NewWallet = lazy(() => import("./components/NewWallet"));
const LoginWallet = lazy(() => import("./components/Login"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={hasKey() ? <Navigate to="/dashboard" /> : <Onboarding />} />
      <Route path="/boarding" element={<Onboarding />} />
      <Route path="/security" element={<Privacy />} />
      <Route path="/recover" element={<Recover />} />
      <Route path="/create" element={<NewWallet />} />
      <Route path="/login" element={<LoginWallet />} />
    </Routes>
  );
};

export default AppRoutes;
