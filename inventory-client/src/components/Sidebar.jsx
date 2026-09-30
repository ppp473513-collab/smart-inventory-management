import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaBoxes,
  FaExchangeAlt,
  FaExclamationTriangle,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaWarehouse,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  let user = {};

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch (error) {
    user = {};
  }

  const isAdmin = user?.role === "admin";

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMobileOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================
  // NORMAL MENU
  // ==========================================

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: FaTachometerAlt,
    },
    {
      name: "Products",
      path: "/products",
      icon: FaBoxes,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: FaExchangeAlt,
    },
    {
      name: "Stock Alerts",
      path: "/alerts",
      icon: FaExclamationTriangle,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: FaUser,
    },
  ];

  // ==========================================
  // ADMIN MENU
  // ==========================================

  const adminMenuItems = [
  {
    name: "Admin Dashboard",
    path: "/admin",
    icon: FaUserShield,
  },
  {
    name: "Users",
    path: "/users",
    icon: FaUsers,
  },
];
  // ==========================================
  // USER INITIAL
  // ==========================================

  const userName = user?.name || "User";

  const userInitial = userName
    .charAt(0)
    .toUpperCase();

  return (
    <>
      {/* ======================================
          MOBILE MENU BUTTON
      ====================================== */}

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg"
      >
        <FaBars />
      </button>

      {/* ======================================
          MOBILE OVERLAY
      ====================================== */}

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-64
          bg-slate-900
          text-white
          flex
          flex-col
          shadow-xl
          transition-transform
          duration-300

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >

        {/* ====================================
            LOGO
        ==================================== */}

        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">

              <FaWarehouse className="text-xl" />

            </div>

            <div>

              <h1 className="text-lg font-bold">
                Smart Inventory
              </h1>

              <p className="text-xs text-slate-400">
                Management System
              </p>

            </div>

          </div>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <FaTimes />
          </button>

        </div>

        {/* ====================================
            MENU
        ==================================== */}

        <nav className="flex-1 px-4 py-6 overflow-y-auto">

          <p className="px-3 mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Main Menu
          </p>

          {/* NORMAL MENU */}

          <div className="space-y-1">

            {menuItems.map(
              ({
                name,
                path,
                icon: Icon,
              }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className={({ isActive }) =>
                    `
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    text-sm
                    font-semibold
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }
                    `
                  }
                >

                  <Icon className="text-lg shrink-0" />

                  <span>{name}</span>

                </NavLink>
              )
            )}

          </div>

          {/* ==================================
              ADMIN MENU
          ================================== */}

          {isAdmin && (
            <div className="mt-6">

              <p className="px-3 mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Administration
              </p>

              <div className="space-y-1">

                {adminMenuItems.map(
                  ({
                    name,
                    path,
                    icon: Icon,
                  }) => (
                    <NavLink
                      key={path}
                      to={path}
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className={({ isActive }) =>
                        `
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        rounded-xl
                        text-sm
                        font-semibold
                        transition-all
                        duration-200

                        ${
                          isActive
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }
                        `
                      }
                    >

                      <Icon className="text-lg shrink-0" />

                      <span>{name}</span>

                    </NavLink>
                  )
                )}

              </div>

            </div>
          )}

        </nav>

        {/* ====================================
            BOTTOM USER SECTION
        ==================================== */}

        <div className="p-4 border-t border-slate-800">

          {/* USER */}

          <div className="flex items-center gap-3 px-3 py-3 mb-2">

            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold">
              {userInitial}
            </div>

            <div className="min-w-0">

              <p className="text-sm font-semibold text-white truncate">
                {userName}
              </p>

              <p className="text-xs text-slate-500">
                {isAdmin
                  ? "Administrator"
                  : "Inventory User"}
              </p>

            </div>

          </div>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;