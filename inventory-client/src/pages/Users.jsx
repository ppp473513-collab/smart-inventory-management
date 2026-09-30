import { useEffect, useMemo, useState } from "react";

import {
  FaUsers,
  FaUserShield,
  FaUser,
  FaTrash,
  FaSearch,
  FaSyncAlt,
  FaUserCog,
  FaUserCheck,
} from "react-icons/fa";

import api from "../services/api";

function Users() {
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(null);

  // =====================================================
  // LOAD USERS
  // =====================================================

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response =
        await api.get("/users");

      const data = Array.isArray(
        response.data
      )
        ? response.data
        : response.data?.users || [];

      setUsers(data);
    } catch (error) {
      console.error(
        "GET USERS ERROR:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadUsers();
  }, []);

  // =====================================================
  // STATISTICS
  // =====================================================

  const statistics = useMemo(() => {
    const total = users.length;

    const admins = users.filter(
      (user) =>
        user.role === "admin"
    ).length;

    const normalUsers = users.filter(
      (user) =>
        user.role === "user"
    ).length;

    return {
      total,
      admins,
      normalUsers,
    };
  }, [users]);

  // =====================================================
  // FILTER USERS
  // =====================================================

  const filteredUsers = useMemo(() => {
    const text =
      search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !text ||
        user.name
          ?.toLowerCase()
          .includes(text) ||
        user.email
          ?.toLowerCase()
          .includes(text);

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    });
  }, [
    users,
    search,
    roleFilter,
  ]);

  // =====================================================
  // GET CURRENT USER
  // =====================================================

  const getCurrentUser = () => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(
        storedUser
      );
    } catch {
      return null;
    }
  };

  // =====================================================
  // CHANGE USER ROLE
  // =====================================================

  const handleRoleChange = async (
    user
  ) => {
    const newRole =
      user.role === "admin"
        ? "user"
        : "admin";

    const message =
      newRole === "admin"
        ? `Give ${user.name} administrator access?`
        : `Remove administrator access from ${user.name}?`;

    const confirmed =
      window.confirm(message);

    if (!confirmed) {
      return;
    }

    // -----------------------------------------
    // DON'T CHANGE YOUR OWN ROLE
    // -----------------------------------------

    const currentUser =
      getCurrentUser();

    const currentUserId =
      currentUser?._id ||
      currentUser?.id;

    if (
      currentUserId &&
      String(currentUserId) ===
        String(user._id)
    ) {
      alert(
        "You cannot change your own role."
      );

      return;
    }

    try {
      setActionLoading(user._id);

      const response =
        await api.put(
          `/users/${user._id}/role`,
          {
            role: newRole,
          }
        );

      const updatedUser =
        response.data?.user;

      if (updatedUser) {
        setUsers(
          (currentUsers) =>
            currentUsers.map(
              (item) =>
                item._id === user._id
                  ? updatedUser
                  : item
            )
        );
      } else {
        await loadUsers();
      }

      alert(
        "User role updated successfully"
      );
    } catch (error) {
      console.error(
        "CHANGE ROLE ERROR:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to change user role"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDelete = async (
    user
  ) => {
    const currentUser =
      getCurrentUser();

    const currentUserId =
      currentUser?._id ||
      currentUser?.id;

    // -----------------------------------------
    // DON'T DELETE YOURSELF
    // -----------------------------------------

    if (
      currentUserId &&
      String(currentUserId) ===
        String(user._id)
    ) {
      alert(
        "You cannot delete your own account."
      );

      return;
    }

    // -----------------------------------------
    // CONFIRM DELETE
    // -----------------------------------------

    const confirmed =
      window.confirm(
        `Delete ${user.name}'s account?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(user._id);

      await api.delete(
        `/users/${user._id}`
      );

      setUsers(
        (currentUsers) =>
          currentUsers.filter(
            (item) =>
              item._id !== user._id
          )
      );

      alert(
        "User deleted successfully"
      );
    } catch (error) {
      console.error(
        "DELETE USER ERROR:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    loadUsers();
  };

  // =====================================================
  // ROLE BADGE
  // =====================================================

  const getRoleBadge = (role) => {
    if (role === "admin") {
      return {
        text: "Admin",
        icon: FaUserShield,
        className:
          "bg-blue-50 text-blue-700 border-blue-200",
      };
    }

    return {
      text: "User",
      icon: FaUser,
      className:
        "bg-slate-50 text-slate-600 border-slate-200",
    };
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-white">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="bg-white border-b border-slate-200 px-6 lg:px-10 py-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
              <FaUsers />
              User Management
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mt-1">
              Users
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage registered users and administrator access.
            </p>

          </div>

          {/* REFRESH */}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 hover:border-blue-300 transition disabled:opacity-50"
          >
            <FaSyncAlt
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

      </div>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="p-6 lg:p-10">

        <div className="max-w-[1700px] mx-auto">

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">

            {/* TOTAL */}

            <div className="bg-white border border-slate-200 rounded-2xl p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Total Users
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {loading
                      ? "..."
                      : statistics.total}
                  </p>

                </div>

                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                  <FaUsers />
                </div>

              </div>

            </div>

            {/* ADMINS */}

            <div className="bg-white border border-slate-200 rounded-2xl p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Administrators
                  </p>

                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {loading
                      ? "..."
                      : statistics.admins}
                  </p>

                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FaUserShield />
                </div>

              </div>

            </div>

            {/* NORMAL USERS */}

            <div className="bg-white border border-slate-200 rounded-2xl p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Normal Users
                  </p>

                  <p className="text-3xl font-bold text-emerald-600 mt-2">
                    {loading
                      ? "..."
                      : statistics.normalUsers}
                  </p>

                </div>

                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FaUserCheck />
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              SEARCH + FILTER
          ================================================= */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">

            <div className="flex flex-col lg:flex-row gap-4">

              {/* SEARCH */}

              <div className="relative flex-1">

                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search by name or email..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

              </div>

              {/* ROLE FILTER */}

              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(
                    e.target.value
                  )
                }
                className="lg:w-56 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >

                <option value="ALL">
                  All Roles
                </option>

                <option value="admin">
                  Administrators
                </option>

                <option value="user">
                  Normal Users
                </option>

              </select>

            </div>

          </div>

          {/* =================================================
              USERS TABLE
          ================================================= */}

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

            {/* TABLE HEADER */}

            <div className="px-6 py-5 border-b border-slate-200">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="font-bold text-slate-900">
                    Registered Users
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    {filteredUsers.length} of{" "}
                    {users.length} users displayed
                  </p>

                </div>

                <FaUserCog className="text-slate-300" />

              </div>

            </div>

            {/* LOADING */}

            {loading ? (

              <div className="p-16 text-center">

                <FaSyncAlt className="mx-auto text-2xl text-slate-300 animate-spin" />

                <p className="text-sm text-slate-500 mt-4">
                  Loading users...
                </p>

              </div>

            ) : filteredUsers.length ===
              0 ? (

              <div className="p-16 text-center">

                <FaUsers className="mx-auto text-4xl text-slate-300" />

                <p className="font-semibold text-slate-600 mt-4">
                  No users found
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Try changing your search or filter.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-slate-50 border-b border-slate-200">

                    <tr>

                      <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        User
                      </th>

                      <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Email
                      </th>

                      <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Role
                      </th>

                      <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Created
                      </th>

                      <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {filteredUsers.map(
                      (user) => {

                        const role =
                          getRoleBadge(
                            user.role
                          );

                        const RoleIcon =
                          role.icon;

                        const isLoading =
                          actionLoading ===
                          user._id;

                        return (
                          <tr
                            key={
                              user._id
                            }
                            className="hover:bg-slate-50 transition"
                          >

                            {/* USER */}

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">

                                  {user.name
                                    ?.charAt(
                                      0
                                    )
                                    ?.toUpperCase() ||
                                    "U"}

                                </div>

                                <div>

                                  <p className="font-semibold text-slate-900">
                                    {user.name ||
                                      "Unnamed User"}
                                  </p>

                                  <p className="text-xs text-slate-400">
                                    User ID:{" "}
                                    {user._id}
                                  </p>

                                </div>

                              </div>

                            </td>

                            {/* EMAIL */}

                            <td className="px-6 py-5">

                              <span className="text-sm text-slate-600">
                                {user.email}
                              </span>

                            </td>

                            {/* ROLE */}

                            <td className="px-6 py-5">

                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${role.className}`}
                              >

                                <RoleIcon />

                                {role.text}

                              </span>

                            </td>

                            {/* CREATED */}

                            <td className="px-6 py-5">

                              <span className="text-sm text-slate-500">
                                {formatDate(
                                  user.createdAt
                                )}
                              </span>

                            </td>

                            {/* ACTIONS */}

                            <td className="px-6 py-5">

                              <div className="flex justify-end gap-2">

                                {/* CHANGE ROLE */}

                                <button
                                  type="button"
                                  disabled={
                                    isLoading
                                  }
                                  onClick={() =>
                                    handleRoleChange(
                                      user
                                    )
                                  }
                                  className="px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition disabled:opacity-50"
                                >

                                  {isLoading
                                    ? "Please wait..."
                                    : user.role ===
                                      "admin"
                                    ? "Make User"
                                    : "Make Admin"}

                                </button>

                                {/* DELETE */}

                                <button
                                  type="button"
                                  disabled={
                                    isLoading
                                  }
                                  onClick={() =>
                                    handleDelete(
                                      user
                                    )
                                  }
                                  className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50"
                                >

                                  <FaTrash className="inline mr-1" />

                                  Delete

                                </button>

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default Users;