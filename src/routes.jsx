import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Onboarding = lazy(() => import("./components/Onboarding"));
const Privacy = lazy(() => import("./components/Privacy"));
const Recover = lazy(() => import("./components/Recover"));
const NewWallet = lazy(()=> import("./components/NewWallet"))

const AppRoutes = () => {
  return (
    // <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/boarding" element={<Onboarding />} />
        <Route path="/security" element={<Privacy />} />
        <Route path="/recover" element={<Recover />} />
        <Route path="/create" element={<NewWallet />} />
      </Routes>
    // </Suspense>
  );
};

export default AppRoutes;
