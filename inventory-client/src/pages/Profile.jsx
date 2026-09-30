import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaLock,
  FaSyncAlt,
} from "react-icons/fa";

import api from "../services/api";
import { useRegisterRefresh } from "../hooks/useRegisterRefresh";

function Profile() {
  const navigate = useNavigate();

  const [refreshing, setRefreshing] =
    useState(false);

  // =====================================================
  // READ SAVED USER
  // =====================================================

  const readSavedUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("user") ||
          "null"
      );
    } catch {
      return null;
    }
  };

  const savedUser = readSavedUser();

  // =====================================================
  // STATE
  // =====================================================

  const [name, setName] = useState(
    savedUser?.name || ""
  );

  const [email, setEmail] = useState(
    savedUser?.email || ""
  );

  const [phone, setPhone] = useState(
    savedUser?.phone || ""
  );

  const [saving, setSaving] =
    useState(false);

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  const loadProfile = useCallback(
    async () => {
      try {
        setRefreshing(true);

        const user =
          readSavedUser();

        setName(
          user?.name || ""
        );

        setEmail(
          user?.email || ""
        );

        setPhone(
          user?.phone || ""
        );
      } finally {
        setRefreshing(false);
      }
    },
    []
  );

  useRegisterRefresh(
    loadProfile,
    [loadProfile]
  );

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanName =
      name.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanPhone =
      phone.trim();

    // -----------------------------------------
    // VALIDATION
    // -----------------------------------------

    if (!cleanName) {
      alert("Name is required.");
      return;
    }

    if (!cleanEmail) {
      alert("Email is required.");
      return;
    }

    try {
      setSaving(true);

      // -----------------------------------------
      // UPDATE PROFILE
      // -----------------------------------------

      const response =
        await api.put(
          "/users/profile",
          {
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
          }
        );

      // -----------------------------------------
      // UPDATE LOCAL STORAGE
      // -----------------------------------------

      const currentUser =
        readSavedUser();

      const updatedUser =
        response.data?.user || {
          ...currentUser,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
        };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      // -----------------------------------------
      // UPDATE STATE
      // -----------------------------------------

      setName(
        updatedUser.name || ""
      );

      setEmail(
        updatedUser.email || ""
      );

      setPhone(
        updatedUser.phone || ""
      );

      alert(
        "Profile updated successfully."
      );

    } catch (error) {
      console.error(
        "UPDATE PROFILE ERROR:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update profile."
      );

    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // INITIAL
  // =====================================================

  const initial =
    name
      ?.charAt(0)
      ?.toUpperCase() || "U";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-white p-5 sm:p-6 lg:p-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">

        <div>

          <p className="text-sm font-semibold text-blue-600">
            Account Settings
          </p>

          <h1 className="text-3xl font-bold text-slate-800 mt-1">
            My Profile
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your personal information.
          </p>

        </div>

        {/* REFRESH */}

        <button
          type="button"
          onClick={loadProfile}
          disabled={refreshing}
          className="w-fit flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition disabled:opacity-60"
        >
          <FaSyncAlt
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* =================================================
          PROFILE
      ================================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* =================================================
            USER CARD
        ================================================= */}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

          <div className="flex flex-col items-center text-center">

            <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-4xl font-bold mb-4">
              {initial}
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              {name || "User"}
            </h2>

            <p className="text-sm text-slate-400 mt-1 break-all">
              {email || "No email"}
            </p>

            <div className="w-full border-t border-slate-100 mt-6 pt-6">

              <div className="flex items-center gap-3 text-left mb-4">

                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FaUser />
                </div>

                <div>

                  <p className="text-xs text-slate-400">
                    Account
                  </p>

                  <p className="text-sm font-semibold text-slate-700">
                    Inventory User
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3 text-left">

                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <FaEnvelope />
                </div>

                <div className="min-w-0">

                  <p className="text-xs text-slate-400">
                    Email
                  </p>

                  <p className="text-sm font-semibold text-slate-700 truncate">
                    {email || "No email"}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">

          <div className="p-6 border-b border-slate-100">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FaEdit />
              </div>

              <div>

                <h2 className="text-lg font-bold text-slate-800">
                  Personal Information
                </h2>

                <p className="text-sm text-slate-400">
                  Update your profile details.
                </p>

              </div>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-6"
          >

            {/* NAME */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>

              <div className="relative">

                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  placeholder="Enter your name"
                />

              </div>

            </div>

            {/* EMAIL */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>

              <div className="relative">

                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed"
                />

              </div>

              <p className="text-xs text-slate-400 mt-2">
                Email cannot be changed here.
              </p>

            </div>

            {/* PHONE */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
              </label>

              <div className="relative">

                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  placeholder="Enter phone number"
                />

              </div>

            </div>

            {/* BUTTONS */}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">

              <button
                type="submit"
                disabled={saving}
                className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/change-password"
                  )
                }
                className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold transition"
              >
                <FaLock />
                Change Password
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Profile;