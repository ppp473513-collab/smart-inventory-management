import React, { useEffect } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";

// =====================================================
// USER PAGES
// =====================================================

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Transactions from "./pages/Transactions";
import StockAlerts from "./pages/StockAlerts";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import StockIn from "./pages/StockIn";
import StockOut from "./pages/StockOut";

// =====================================================
// ADMIN
// =====================================================

import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";

// =====================================================
// USER LAYOUT
// =====================================================

import Layout from "./components/Layout";

// =====================================================
// SCROLL TO TOP
// =====================================================

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// =====================================================
// USER PROTECTED ROUTE
// =====================================================

function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
}

// =====================================================
// ADMIN PROTECTED ROUTE
// =====================================================

function AdminRoute() {
  const token = localStorage.getItem("token");

  // No login token
  if (!token) {
    return (
      <Navigate
        to="/admin-login"
        replace
      />
    );
  }

  let user = null;

  try {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error(
      "ADMIN USER DATA ERROR:",
      error
    );

    user = null;
  }

  // Only administrators can enter Admin Control Center
  if (!user || user.role !== "admin") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>

      <ScrollToTop />

      <Routes>

        {/* =================================================
            USER AUTHENTICATION
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signin"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =================================================
            ADMIN LOGIN
        ================================================= */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* =================================================
            NORMAL USER APPLICATION
        ================================================= */}

        <Route element={<ProtectedRoute />}>

          <Route element={<Layout />}>

            {/* USER DASHBOARD */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* PRODUCTS */}

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/products/add"
              element={<AddProduct />}
            />

            <Route
              path="/products/edit/:id"
              element={<EditProduct />}
            />

            {/* STOCK IN */}

            <Route
              path="/products/stock-in/:id"
              element={<StockIn />}
            />

            <Route
              path="/stock-in/:id"
              element={<StockIn />}
            />

            {/* STOCK OUT */}

            <Route
              path="/products/stock-out/:id"
              element={<StockOut />}
            />

            <Route
              path="/stock-out/:id"
              element={<StockOut />}
            />

            {/* STOCK REDIRECTS */}

            <Route
              path="/stock-in"
              element={
                <Navigate
                  to="/products"
                  replace
                />
              }
            />

            <Route
              path="/stock-out"
              element={
                <Navigate
                  to="/products"
                  replace
                />
              }
            />

            {/* TRANSACTIONS */}

            <Route
              path="/transactions"
              element={<Transactions />}
            />

            {/* STOCK ALERTS */}

            <Route
              path="/stock-alerts"
              element={<StockAlerts />}
            />

            {/* ALERTS */}

            <Route
              path="/alerts"
              element={<Alerts />}
            />

            {/* PROFILE */}

            <Route
              path="/profile"
              element={<Profile />}
            />

            {/* CHANGE PASSWORD */}

            <Route
              path="/change-password"
              element={<ChangePassword />}
            />

          </Route>

        </Route>

        {/* =================================================
            ADMIN APPLICATION
        ================================================= */}

        <Route element={<AdminRoute />}>

          <Route
            path="/admin"
            element={<AdminLayout />}
          />

        </Route>

        {/* =================================================
            ROOT
        ================================================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* =================================================
            UNKNOWN ROUTES
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;