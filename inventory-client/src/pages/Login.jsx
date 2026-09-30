import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  FaWarehouse,
  FaArrowRight,
  FaShieldAlt,
  FaUserPlus,
  FaUserShield,
} from "react-icons/fa";

import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      const data = response.data;

      if (!data.token || !data.user) {
        setError("Invalid server response");
        return;
      }

      // Save authentication
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Admin accounts go to admin interface
      if (data.user.role === "admin") {
        navigate("/admin", {
          replace: true,
        });
        return;
      }

      // Normal users go to user dashboard
      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-5 py-10">

      <div className="w-full max-w-md">

        {/* =====================================================
            BRAND
        ===================================================== */}

        <div className="text-center mb-7">

          <div className="mx-auto w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center shadow-xl shadow-teal-900/30">
            <FaWarehouse className="text-white text-2xl" />
          </div>

          <h1 className="text-3xl font-bold text-white mt-5">
            Smart Inventory
          </h1>

          <p className="text-slate-400 text-sm mt-2">
            Inventory Management System
          </p>

        </div>

        {/* =====================================================
            LOGIN CARD
        ===================================================== */}

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="p-8">

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-slate-900">
                Welcome back
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Sign in to continue to your account
              </p>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">
                {error}
              </div>
            )}

            {/* =================================================
                USER LOGIN FORM
            ================================================= */}

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}

              <div className="mb-5">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>

                <div className="relative">

                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 bg-white outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="mb-6">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">

                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 bg-white outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />

                </div>

              </div>

              {/* USER SIGN IN */}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >

                {loading
                  ? "Signing in..."
                  : "User Sign In"}

                {!loading && (
                  <FaArrowRight />
                )}

              </button>

            </form>

            {/* =================================================
                USER REGISTRATION
            ================================================= */}

            <div className="mt-7 pt-6 border-t border-slate-100">

              <div className="text-center">

                <p className="text-sm text-slate-500">
                  New user?
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/register")
                  }
                  className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-teal-600 text-teal-600 hover:bg-teal-50 font-bold transition"
                >

                  <FaUserPlus />

                  Create User Account

                </button>

              </div>

            </div>

            {/* =================================================
                SEPARATOR
            ================================================= */}

            <div className="flex items-center gap-3 my-6">

              <div className="flex-1 h-px bg-slate-200" />

              <span className="text-xs font-bold text-slate-400">
                OR
              </span>

              <div className="flex-1 h-px bg-slate-200" />

            </div>

            {/* =================================================
                ADMIN LOGIN
            ================================================= */}

            <div className="rounded-2xl bg-slate-950 p-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">

                  <FaUserShield className="text-amber-400 text-lg" />

                </div>

                <div>

                  <h3 className="text-white font-bold">
                    Administrator
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    Authorized administrators only
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin-login")
                }
                className="w-full mt-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition flex items-center justify-center gap-2"
              >

                <FaShieldAlt />

                Admin Sign In

              </button>

            </div>

          </div>

          {/* =================================================
              SECURITY FOOTER
          ================================================= */}

          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100">

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">

              <FaShieldAlt className="text-teal-600" />

              Secure JWT authentication

            </div>

          </div>

        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <p className="text-center text-xs text-slate-500 mt-6">
          Smart Inventory Management System
        </p>

      </div>

    </div>
  );
}

export default Login;