import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
} from "react-icons/fa";

import api from "../services/api";

function ChangePassword({
  isAdmin = false,
  onSuccess,
  onCancel,
}) {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // -----------------------------------------
    // VALIDATION
    // -----------------------------------------

    if (!currentPassword.trim()) {
      setError(
        "Enter your current password."
      );
      return;
    }

    if (!newPassword.trim()) {
      setError(
        "Enter a new password."
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "New passwords do not match."
      );
      return;
    }

    if (
      currentPassword ===
      newPassword
    ) {
      setError(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setSaving(true);

      // -----------------------------------------
      // CHANGE PASSWORD API
      // -----------------------------------------

      await api.put(
        "/users/change-password",
        {
          currentPassword,
          newPassword,
        }
      );

      // -----------------------------------------
      // CLEAR FORM
      // -----------------------------------------

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccess(
        "Password changed successfully."
      );

      // -----------------------------------------
      // ADMIN
      // -----------------------------------------

      if (isAdmin === true) {
        /*
          IMPORTANT:

          Do NOT use navigate("/profile") here.

          Admin Profile is controlled by AdminLayout
          using activeSection.
        */

        if (
          typeof onSuccess ===
          "function"
        ) {
          setTimeout(() => {
            onSuccess();
          }, 800);
        }

        return;
      }

      // -----------------------------------------
      // NORMAL USER
      // -----------------------------------------

      setTimeout(() => {
        navigate("/profile");
      }, 800);

    } catch (error) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to change password."
      );

    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {

    if (isAdmin === true) {

      if (
        typeof onCancel ===
        "function"
      ) {
        onCancel();
      }

      return;
    }

    navigate("/profile");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen w-full max-w-full min-w-0 bg-white text-slate-900 overflow-x-hidden">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6">

        <div className="mb-8">

          <p className="text-sm font-semibold text-amber-600">
            Account Security
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Change Password
          </h1>

          <p className="text-slate-500 mt-2">
            Keep your inventory account secure.
          </p>

        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="w-full max-w-3xl mx-auto">

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* TOP */}

            <div className="p-5 sm:p-6 border-b border-slate-200">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 shrink-0 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">

                  <FaShieldAlt className="text-xl" />

                </div>

                <div className="min-w-0">

                  <h2 className="text-lg font-bold text-slate-900">
                    Password Security
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Choose a strong password that you don't use elsewhere.
                  </p>

                </div>

              </div>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6 space-y-6"
            >

              {/* ERROR */}

              {error && (
                <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {success && (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-700">
                  {success}
                </div>
              )}

              {/* CURRENT PASSWORD */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Current Password
                </label>

                <div className="relative">

                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type={
                      showCurrent
                        ? "text"
                        : "password"
                    }
                    value={
                      currentPassword
                    }
                    onChange={(e) =>
                      setCurrentPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter current password"
                    autoComplete="current-password"
                    className="w-full pl-11 pr-12 py-3 border border-slate-200 rounded-xl outline-none bg-white text-slate-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrent(
                        (value) =>
                          !value
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600"
                  >
                    {showCurrent ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

              </div>

              {/* NEW PASSWORD */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  New Password
                </label>

                <div className="relative">

                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type={
                      showNew
                        ? "text"
                        : "password"
                    }
                    value={
                      newPassword
                    }
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    className="w-full pl-11 pr-12 py-3 border border-slate-200 rounded-xl outline-none bg-white text-slate-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNew(
                        (value) =>
                          !value
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600"
                  >
                    {showNew ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

                <p className="text-xs text-slate-400 mt-2">
                  Minimum 6 characters.
                </p>

              </div>

              {/* CONFIRM PASSWORD */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm New Password
                </label>

                <div className="relative">

                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type={
                      showConfirm
                        ? "text"
                        : "password"
                    }
                    value={
                      confirmPassword
                    }
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    className="w-full pl-11 pr-12 py-3 border border-slate-200 rounded-xl outline-none bg-white text-slate-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirm(
                        (value) =>
                          !value
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600"
                  >
                    {showConfirm ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

              </div>

              {/* PASSWORD TIPS */}

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">

                <p className="text-sm font-semibold text-amber-800 mb-2">
                  Password tips
                </p>

                <ul className="text-xs text-amber-700 space-y-1">

                  <li>
                    • Use at least 6 characters.
                  </li>

                  <li>
                    • Avoid easily guessed information.
                  </li>

                  <li>
                    • Don't reuse your password on other websites.
                  </li>

                </ul>

              </div>

              {/* BUTTONS */}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition disabled:opacity-50"
                >
                  {saving
                    ? "Updating..."
                    : "Update Password"}
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ChangePassword;