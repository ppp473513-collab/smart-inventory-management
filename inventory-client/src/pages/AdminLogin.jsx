import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaShieldAlt,
  FaEnvelope,
  FaLock,
  FaArrowLeft,
} from "react-icons/fa";

import api from "../services/api";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Administrator email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);

      // ----------------------------------------
      // LOGIN
      // ----------------------------------------

      const response = await api.post(
        "/auth/login",
        {
          email: cleanEmail,
          password,
        }
      );

      const data = response.data;

      // ----------------------------------------
      // CHECK TOKEN
      // ----------------------------------------

      if (!data?.token) {
        setError(
          "Authentication failed. No token was returned."
        );
        return;
      }

      // ----------------------------------------
      // CHECK USER
      // ----------------------------------------

      if (!data?.user) {
        setError(
          "Authentication failed. User information was not returned."
        );
        return;
      }

      // ----------------------------------------
      // ADMIN ONLY
      // ----------------------------------------

      if (data.user.role !== "admin") {
        setError(
          "Access denied. This account is not an administrator."
        );
        return;
      }

      // ----------------------------------------
      // CLEAR OLD SESSION
      // ----------------------------------------

      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // ----------------------------------------
      // SAVE ADMIN SESSION
      // ----------------------------------------

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // ----------------------------------------
      // GO TO ADMIN INTERFACE
      // ----------------------------------------

      navigate("/admin", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "ADMIN LOGIN ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Invalid administrator credentials"
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-5">

      <div className="w-full max-w-md">

        {/* BACK TO USER LOGIN */}

        <button
          type="button"
          onClick={() =>
            navigate("/login")
          }
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <FaArrowLeft />

          Back to User Login
        </button>

        {/* CARD */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">

          {/* HEADER */}

          <div className="p-8 text-center border-b border-slate-800">

            <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/30">

              <FaShieldAlt className="text-white text-2xl" />

            </div>

            <h1 className="text-2xl font-bold text-white mt-5">
              Admin Control Center
            </h1>

            <p className="text-sm text-slate-400 mt-2">
              Authorized administrators only
            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="p-8"
          >

            {/* ERROR */}

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* EMAIL */}

            <div className="mb-5">

              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Administrator Email
              </label>

              <div className="relative">

                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="mb-6">

              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Password
              </label>

              <div className="relative">

                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter administrator password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                />

              </div>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Authenticating..."
                : "Secure Admin Sign In"}
            </button>

          </form>

          {/* SECURITY MESSAGE */}

          <div className="px-8 pb-8">

            <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4">

              <div className="flex gap-3">

                <FaShieldAlt className="text-blue-500 mt-0.5 shrink-0" />

                <p className="text-xs text-slate-400 leading-relaxed">
                  This portal is restricted to authorized
                  administrators. Normal user accounts cannot
                  access the administrator control center.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;