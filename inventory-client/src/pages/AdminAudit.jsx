import { useEffect, useState } from "react";

import {
  FaHistory,
  FaSyncAlt,
  FaShieldAlt,
  FaSearch,
  FaCheckCircle,
} from "react-icons/fa";

import api from "../services/api";

function AdminAudit() {
  // =====================================================
  // STATE
  // =====================================================

  const [logs, setLogs] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  // =====================================================
  // LOAD AUDIT LOGS
  // =====================================================

  const loadLogs = async () => {
    try {
      setRefreshing(true);
      setError("");

      const response =
        await api.get("/audit");

      setLogs(
        Array.isArray(
          response.data?.logs
        )
          ? response.data.logs
          : []
      );
    } catch (error) {
      console.error(
        "AUDIT LOG ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load audit logs"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadLogs();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredLogs =
    logs.filter((log) => {
      const text =
        search.toLowerCase().trim();

      if (!text) {
        return true;
      }

      return (
        log.action
          ?.toLowerCase()
          .includes(text) ||
        log.description
          ?.toLowerCase()
          .includes(text) ||
        log.user?.name
          ?.toLowerCase()
          .includes(text) ||
        log.user?.email
          ?.toLowerCase()
          .includes(text)
      );
    });

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(
        date
      ).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "-";
    }
  };

  // =====================================================
  // ADMINISTRATOR COUNT
  // =====================================================

  const administratorCount =
    new Set(
      logs
        .map(
          (log) =>
            log.user?._id
        )
        .filter(Boolean)
    ).size;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">

            <FaSyncAlt className="text-2xl animate-spin" />

          </div>

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading audit history...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen w-full bg-white px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">

        <div className="w-full max-w-2xl bg-white border border-red-200 rounded-2xl p-8 sm:p-10 text-center shadow-sm">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">

            <FaShieldAlt className="text-2xl" />

          </div>

          <h2 className="text-xl font-bold text-slate-800 mt-5">
            Audit Log Unavailable
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            {error}
          </p>

          <button
            type="button"
            onClick={loadLogs}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 mt-6 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
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
              : "Try Again"}

          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <div className="min-h-screen w-full max-w-full min-w-0 bg-white text-slate-900 overflow-x-hidden">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="w-full bg-white border-b border-slate-200">

        <div className="w-full max-w-full min-w-0 px-4 sm:px-6 lg:px-8 xl:px-10 py-6">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            {/* TITLE */}

            <div className="min-w-0">

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600">

                <FaHistory />

                <span>
                  Security & Compliance
                </span>

              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                Audit Log
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Track administrator activity across the system.
              </p>

            </div>

            {/* REFRESH */}

            <button
              type="button"
              onClick={loadLogs}
              disabled={refreshing}
              className="
                w-full
                sm:w-auto
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-amber-500
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-amber-600
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
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

        </div>

      </header>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="w-full max-w-full min-w-0 px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-8">

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full">

          {/* TOTAL */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm min-w-0">

            <p className="text-sm text-slate-500">
              Total Activities
            </p>

            <p className="text-3xl font-bold text-slate-900 mt-2">
              {logs.length}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              Recorded administrative actions
            </p>

          </div>

          {/* ADMINISTRATORS */}

          <div className="bg-white border border-amber-200 rounded-2xl p-5 sm:p-6 shadow-sm min-w-0">

            <p className="text-sm text-slate-500">
              Administrators
            </p>

            <p className="text-3xl font-bold text-amber-600 mt-2">
              {administratorCount}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              Administrators with recorded activity
            </p>

          </div>

          {/* SECURITY */}

          <div className="bg-white border border-emerald-200 rounded-2xl p-5 sm:p-6 shadow-sm min-w-0">

            <p className="text-sm text-slate-500">
              Security Status
            </p>

            <div className="flex items-center gap-3 mt-3">

              <div className="w-3 h-3 shrink-0 rounded-full bg-emerald-500" />

              <p className="text-base sm:text-lg font-bold text-slate-800">
                Activity Monitoring Active
              </p>

            </div>

            <p className="text-xs text-slate-400 mt-3">
              Administrative actions are being recorded.
            </p>

          </div>

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="mt-7 w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">

          <div className="relative w-full">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search activity, administrator or action..."
              className="
                w-full
                min-w-0
                pl-11
                pr-4
                py-3
                border
                border-slate-200
                rounded-xl
                outline-none
                text-slate-900
                bg-white
                focus:border-amber-500
                focus:ring-2
                focus:ring-amber-500/10
              "
            />

          </div>

        </div>

        {/* =================================================
            AUDIT TABLE
        ================================================= */}

        <div className="mt-5 w-full max-w-full min-w-0 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

          {/* TABLE HEADER */}

          <div className="px-5 sm:px-6 py-5 border-b border-slate-200">

            <h2 className="font-bold text-slate-900">
              Administrative Activity
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              {filteredLogs.length} records displayed
            </p>

          </div>

          {/* NO DATA */}

          {filteredLogs.length ===
          0 ? (

            <div className="p-12 sm:p-16 text-center">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">

                <FaHistory className="text-2xl" />

              </div>

              <p className="font-semibold text-slate-600 mt-4">
                No audit activity found
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Administrative actions will appear here.
              </p>

            </div>

          ) : (

            <div className="w-full max-w-full overflow-x-auto">

              <table className="w-full min-w-[760px]">

                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr>

                    <th className="px-4 sm:px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-400 whitespace-nowrap">
                      Action
                    </th>

                    <th className="px-4 sm:px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-400 whitespace-nowrap">
                      Administrator
                    </th>

                    <th className="px-4 sm:px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-400">
                      Description
                    </th>

                    <th className="px-4 sm:px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-400 whitespace-nowrap">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredLogs.map(
                    (log) => (

                      <tr
                        key={log._id}
                        className="hover:bg-slate-50 transition"
                      >

                        {/* ACTION */}

                        <td className="px-4 sm:px-6 py-5">

                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase whitespace-nowrap">

                            <FaShieldAlt />

                            {(log.action ||
                              "activity"
                            ).replace(
                              /_/g,
                              " "
                            )}

                          </span>

                        </td>

                        {/* ADMINISTRATOR */}

                        <td className="px-4 sm:px-6 py-5">

                          <p className="font-semibold text-slate-800 whitespace-nowrap">
                            {log.user
                              ?.name ||
                              "Unknown"}
                          </p>

                          <p className="text-xs text-slate-400 mt-1 whitespace-nowrap">
                            {log.user
                              ?.email ||
                              "-"}
                          </p>

                        </td>

                        {/* DESCRIPTION */}

                        <td className="px-4 sm:px-6 py-5 text-sm text-slate-600">

                          <div className="max-w-md">
                            {log.description ||
                              "Administrative activity"}
                          </div>

                        </td>

                        {/* DATE */}

                        <td className="px-4 sm:px-6 py-5 text-sm text-slate-500 whitespace-nowrap">

                          {formatDate(
                            log.createdAt
                          )}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* =================================================
            FOOTER STATUS
        ================================================= */}

        <div className="mt-6 w-full bg-white border border-slate-200 rounded-2xl p-5">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FaCheckCircle />
              </div>

              <div>

                <p className="font-semibold text-slate-800">
                  Audit Monitoring
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Administrative activity tracking is active.
                </p>

              </div>

            </div>

            <span className="w-fit inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-700">

              <span className="w-2 h-2 rounded-full bg-emerald-500" />

              ACTIVE

            </span>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminAudit;