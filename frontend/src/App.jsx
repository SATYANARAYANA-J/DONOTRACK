import React, { useState, useEffect } from "react";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Routes, Route } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";
import LiveFeed from "./pages/LiveFeed";

import { DonateProvider } from "./context/DonateContext";
import DonateModal from "./components/donate/DonateModal";

import DonorDashboard from "./pages/DonorDashboard";
import NGODashboard from "./pages/NGODashboard";

import AuditTrail from "./pages/AuditTrail";
import UploadProof from "./pages/UploadProof";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";

import CreateCampaign from "./pages/CreateCampaign";
import SpendingUpdate from "./pages/SpendingUpdate";
import DonationDetails from "./pages/DonationDetails";

import LandingPage from "./pages/LandingPage";
import Loader from "./components/Loader";

// Placeholder for unknown routes
const Placeholder = ({ title }) => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold text-slate-300">{title}</h1>
    <p className="text-slate-400 mt-2">Coming soon...</p>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const localToken = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        {localToken ? children : <RedirectToSignIn />}
      </SignedOut>
    </>
  );
};

function App() {
  const [loading, setLoading] = useState(false);

  const LOADER_DURATION = 2500;
  const LOADER_SRC = "/loading.gif";

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      anchorPlacement: "top-bottom"
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        AOS.refreshHard();
      }, 150);
    }
  }, [loading]);

  return (
    <LazyMotion features={domAnimation}>
      <>
        {loading && (
          <Loader
            src={LOADER_SRC}
            duration={LOADER_DURATION}
            bgColor="#447BBE"
            onFinish={() => setLoading(false)}
          />
        )}

        <DonateProvider>
          {/* NOTE: BrowserRouter lives in index.jsx */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<Layout />}>
              <Route path="/explore" element={<Home />} />
              <Route path="/feed" element={<LiveFeed />} />
              <Route path="/campaigns" element={<Campaigns />} />

              <Route
                path="/campaigns/new"
                element={<ProtectedRoute><CreateCampaign /></ProtectedRoute>}
              />

              <Route path="/updates" element={<UploadProof />} />

              <Route
                path="/updates/new"
                element={<ProtectedRoute><SpendingUpdate /></ProtectedRoute>}
              />

              <Route path="/audit" element={<AuditTrail />} />

              <Route
                path="/donations"
                element={<ProtectedRoute><DonorDashboard /></ProtectedRoute>}
              />

              <Route path="/donation/:id" element={<DonationDetails />} />

              <Route
                path="/ngo"
                element={<ProtectedRoute><NGODashboard /></ProtectedRoute>}
              />

              <Route
                path="/settings"
                element={<ProtectedRoute><Settings /></ProtectedRoute>}
              />

              <Route path="*" element={<Placeholder title="404 Not Found" />} />
            </Route>
          </Routes>

          <DonateModal />
        </DonateProvider>
      </>
    </LazyMotion>
  );
}

export default App;
