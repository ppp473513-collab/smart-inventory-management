import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaWarehouse,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";

import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setSuccess(
        "Registration successful. Redirecting to login..."
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);
    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-5">

      <div className="w-full max-w-md">

        {/* LOGO */}

        <div className="text-center mb-8">

          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/30">
            <FaWarehouse className="text-white text-2xl" />
          </div>

          <h1 className="text-3xl font-bold text-white mt-5">
            Smart Inventory
          </h1>

          <p className="text-slate-400 text-sm mt-2">
            Create your inventory account
          </p>

        </div>

        {/* CARD */}

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="p-8">

            <h2 className="text-2xl font-bold text-slate-900">
              Create account
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Start managing your inventory today
            </p>

            {/* ERROR */}

            {error && (
              <div className="mt-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="mt-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                {success}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6"
            >

              {/* NAME */}

              <div className="mb-4">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>

                <div className="relative">

                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your name"
                    autoComplete="name"
                    className="w-full border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="mb-4">

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
                    className="w-full border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="mb-4">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">

                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    className="w-full border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="mb-6">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>

                <div className="relative">

                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className="w-full border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />

                </div>

              </div>

              {/* REGISTER BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}

                {!loading && (
                  <FaArrowRight />
                )}
              </button>

            </form>

            {/* LOGIN LINK */}

            <div className="mt-7 pt-6 border-t border-slate-100 text-center">

              <p className="text-sm text-slate-500">
                Already have an account?{" "}

                <button
                  type="button"
                  onClick={() =>
                    navigate("/login")
                  }
                  className="font-bold text-emerald-600 hover:text-emerald-700 transition"
                >
                  Sign in
                </button>

              </p>

            </div>

          </div>

          {/* SECURITY */}

          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100">

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">

              <FaShieldAlt className="text-emerald-600" />

              Your password is securely encrypted

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;