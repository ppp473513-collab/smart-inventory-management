import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  FaBell,
  FaChevronDown,
  FaExclamationTriangle,
  FaBoxOpen,
  FaSignOutAlt,
  FaSyncAlt,
  FaUser,
} from "react-icons/fa";

import { useRefresh } from "../context/RefreshContext";
import api from "../services/api";

function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { refresh, refreshing } = useRefresh();

  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const [alerts, setAlerts] = useState([]);

  // ==========================================
  // GET USER SAFELY
  // ==========================================

  let user = {};

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch {
    user = {};
  }

  // ==========================================
  // PAGE TITLE
  // ==========================================

  const getTitle = () => {
    const path = location.pathname;

    if (path === "/dashboard") {
      return "Dashboard";
    }

    if (path === "/products") {
      return "Products";
    }

    if (path === "/products/add") {
      return "Add Product";
    }

    if (path.includes("/products/edit")) {
      return "Edit Product";
    }

    if (path === "/stock-in") {
      return "Stock In";
    }

    if (path === "/stock-out") {
      return "Stock Out";
    }

    if (path === "/transactions") {
      return "Transactions";
    }

    // IMPORTANT:
    // Use /stock-alerts, not /alerts
    if (path === "/stock-alerts") {
      return "Stock Alerts";
    }

    if (path === "/profile") {
      return "Profile";
    }

    if (path === "/change-password") {
      return "Change Password";
    }

    return "Smart Inventory";
  };

  // ==========================================
  // FETCH STOCK ALERTS
  // ==========================================

  const fetchAlerts = async () => {
    try {
      const response = await api.get("/products");

      const products = Array.isArray(response.data)
        ? response.data
        : response.data?.products || [];

      const alertProducts = products.filter(
        (product) =>
          Number(product.quantity || 0) <= 10
      );

      setAlerts(alertProducts);
    } catch (error) {
      console.error(
        "Notification error:",
        error.response?.data ||
          error.message
      );

      // Don't break the Topbar if alerts fail
      setAlerts([]);
    }
  };

  // ==========================================
  // LOAD ALERTS
  // ==========================================

  useEffect(() => {
    fetchAlerts();
  }, []);

  // ==========================================
  // CLOSE DROPDOWNS WHEN PAGE CHANGES
  // ==========================================

  useEffect(() => {
    setOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================
  // USER NAME
  // ==========================================

  const userName =
    user?.name ||
    user?.username ||
    "User";

  const userInitial = userName
    .charAt(0)
    .toUpperCase();

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <header className="w-full bg-white border-b border-slate-200 shrink-0">

      <div className="w-full px-5 sm:px-6 lg:px-8 py-4">

        <div className="flex items-center justify-between gap-4">

          {/* ====================================
              LEFT
          ==================================== */}

          <div className="min-w-0">

            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 truncate">
              {getTitle()}
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your inventory efficiently
            </p>

          </div>

          {/* ====================================
              RIGHT
          ==================================== */}

          <div className="flex items-center gap-3">

            {/* ==================================
                REFRESH
            ================================== */}

            <button
              type="button"
              onClick={() => {
                refresh();
                fetchAlerts();
              }}
              disabled={refreshing}
              title="Refresh page data"
              className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition disabled:opacity-60"
            >
              <FaSyncAlt
                className={
                  refreshing ? "animate-spin" : ""
                }
              />
            </button>

            {/* ==================================
                NOTIFICATIONS
            ================================== */}

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setNotificationsOpen(
                    (value) => !value
                  )
                }
                className="relative w-10 h-10 rounded-xl bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition"
              >

                <FaBell className="text-lg" />

                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {alerts.length > 99
                      ? "99+"
                      : alerts.length}
                  </span>
                )}

              </button>

              {/* NOTIFICATION DROPDOWN */}

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-[320px] sm:w-[380px] bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[100]">

                  {/* HEADER */}

                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">

                    <div>

                      <h3 className="font-bold text-slate-800">
                        Notifications
                      </h3>

                      <p className="text-xs text-slate-400 mt-1">
                        Inventory alerts
                      </p>

                    </div>

                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                      {alerts.length} alerts
                    </span>

                  </div>

                  {/* ALERTS */}

                  {alerts.length === 0 ? (
                    <div className="p-8 text-center">

                      <div className="w-12 h-12 mx-auto rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-3 text-xl">
                        ✓
                      </div>

                      <p className="font-semibold text-slate-700">
                        All good!
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        No stock alerts right now.
                      </p>

                    </div>
                  ) : (
                    <div className="max-h-[350px] overflow-y-auto">

                      {alerts.map((product) => {

                        const quantity = Number(
                          product.quantity || 0
                        );

                        const isOut =
                          quantity === 0;

                        return (
                          <button
                            key={product._id}
                            type="button"
                            onClick={() => {
                              setNotificationsOpen(
                                false
                              );

                              navigate(
                                `/products/edit/${product._id}`
                              );
                            }}
                            className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-slate-50 border-b border-slate-50 transition"
                          >

                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                isOut
                                  ? "bg-red-50 text-red-600"
                                  : "bg-yellow-50 text-yellow-600"
                              }`}
                            >
                              {isOut ? (
                                <FaBoxOpen />
                              ) : (
                                <FaExclamationTriangle />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">

                              <p className="font-semibold text-sm text-slate-700 truncate">
                                {product.name}
                              </p>

                              <p
                                className={`text-xs mt-1 ${
                                  isOut
                                    ? "text-red-500"
                                    : "text-yellow-600"
                                }`}
                              >
                                {isOut
                                  ? "Out of stock"
                                  : `${quantity} units remaining`}
                              </p>

                            </div>

                            <span
                              className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                                isOut
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {isOut
                                ? "OUT"
                                : "LOW"}
                            </span>

                          </button>
                        );
                      })}

                    </div>
                  )}

                  {/* FOOTER */}

                  <button
                    type="button"
                    onClick={() => {
                      setNotificationsOpen(false);

                      navigate("/stock-alerts");
                    }}
                    className="w-full px-5 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition"
                  >
                    View All Stock Alerts
                  </button>

                </div>
              )}

            </div>

            {/* ==================================
                USER DROPDOWN
            ================================== */}

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setOpen((value) => !value)
                }
                className="flex items-center gap-2 sm:gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-50 transition"
              >

                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {userInitial}
                </div>

                <div className="hidden sm:block text-left">

                  <p className="text-sm font-semibold text-slate-700">
                    {userName}
                  </p>

                  <p className="text-xs text-slate-400">
                    Inventory User
                  </p>

                </div>

                <FaChevronDown className="hidden sm:block text-xs text-slate-400" />

              </button>

              {/* USER DROPDOWN */}

              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[100]">

                  <div className="px-4 py-3 border-b border-slate-100">

                    <p className="text-sm font-bold text-slate-700">
                      {userName}
                    </p>

                    <p className="text-xs text-slate-400 truncate mt-1">
                      {user?.email || "No email"}
                    </p>

                  </div>

                  {/* PROFILE */}

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <FaUser className="text-blue-500" />
                    Profile
                  </button>

                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-3 flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;