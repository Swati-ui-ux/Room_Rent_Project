import { Routes, Route, Navigate } from "react-router-dom";
import { useFirebase } from "./context/FirebaseContext";

// pages
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";

import OwnerDashboard from "./components/pages/owner/OwnerDashboard";
import OwnerProfile from "./components/pages/owner/OwnerProfile";

import TenantsDashboard from "./components/pages/tenant/TenantsDashboard";
import TenantProfile from "./components/pages/tenant/TenantProfile";

import { Outlet } from "react-router-dom";
import Payments from "./components/pages/owner/Payments"

/* ---------- OWNER LAYOUT ---------- */
const OwnerLayout = () => <Outlet />;

/* ---------- TENANT LAYOUT ---------- */
const TenantLayout = () => <Outlet />;

const App = () => {
  const { isLoggedIn, userData, loading } = useFirebase();

  if (loading || (isLoggedIn && !userData)) {
    return <h2 style={{ padding: 20 }}>Loading user...</h2>;
  }

  return (
    <Routes>
      {/* ---------- PUBLIC ---------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ---------- OWNER ROUTES ---------- */}
      <Route
        path="/owner"
        element={
          !isLoggedIn ? (
            <Navigate to="/login" />
          ) : userData.role === "owner" ? (
            <OwnerLayout />
          ) : (
            <Navigate to="/tenant" />
          )
        }
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="profile" element={<OwnerProfile />} />
         <Route path="payment" element={<Payments />} />
      </Route>

      {/* ---------- TENANT ROUTES ---------- */}
      <Route
        path="/tenant"
        element={
          !isLoggedIn ? (
            <Navigate to="/login" />
          ) : userData.role === "tenant" ? (
            <TenantLayout />
          ) : (
            <Navigate to="/owner" />
          )
        }
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<TenantsDashboard />} />
        <Route path="profile" element={<TenantProfile />} />
      </Route>

      {/* ---------- DEFAULT ---------- */}
      <Route
        path="/"
        element={
          isLoggedIn
            ? userData.role === "owner"
              ? <Navigate to="/owner" />
              : <Navigate to="/tenant" />
            : <Navigate to="/login" />
        }
      />

      {/* ---------- FALLBACK ---------- */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
