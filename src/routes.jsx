import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Onboarding = lazy(() => import("./components/Onboarding"));
const Privacy = lazy(() => import("./components/Privacy"));
const Recover = lazy(() => import("./components/Recover"));
const NewWallet = lazy(() => import("./components/NewWallet"));
const LoginWallet = lazy(() => import("./components/Login"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const AppRoutes = () => {
  return (
    // <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Onboarding />} />
      <Route path="/boarding" element={<Onboarding />} />
      <Route path="/security" element={<Privacy />} />
      <Route path="/recover" element={<Recover />} />
      <Route path="/create" element={<NewWallet />} />
      <Route path="/login" element={<LoginWallet />} />
    </Routes>
    // </Suspense>
  );
};

export default AppRoutes;
