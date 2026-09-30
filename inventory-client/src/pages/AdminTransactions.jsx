import { useEffect, useState } from "react";

import {
  FaExchangeAlt,
  FaArrowDown,
  FaArrowUp,
  FaSyncAlt,
  FaSearch,
} from "react-icons/fa";

import api from "../services/api";

function AdminTransactions() {
  // =====================================================
  // STATE
  // =====================================================

  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [type, setType] = useState("ALL");

  // =====================================================
  // LOAD TRANSACTIONS
  // =====================================================

  const loadTransactions = async () => {
    try {
      setRefreshing(true);
      setError("");

      const response =
        await api.get("/stock/history");

      setTransactions(
        Array.isArray(response.data)
          ? response.data
          : response.data?.transactions || []
      );
    } catch (error) {
      console.error(
        "ADMIN TRANSACTIONS ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load transactions"
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
    loadTransactions();
  }, []);

  // =====================================================
  // FILTER TRANSACTIONS
  // =====================================================

  const filteredTransactions =
    transactions.filter((transaction) => {
      const productName =
        transaction.product?.name || "";

      const userName =
        transaction.user?.name || "";

      const text = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !text ||
        productName
          .toLowerCase()
          .includes(text) ||
        userName
          .toLowerCase()
          .includes(text);

      const matchesType =
        type === "ALL" ||
        transaction.type === type;

      return (
        matchesSearch &&
        matchesType
      );
    });

  // =====================================================
  // STOCK IN
  // =====================================================

  const stockIn = transactions
    .filter((t) => t.type === "IN")
    .reduce(
      (sum, t) =>
        sum + Number(t.quantity || 0),
      0
    );

  // =====================================================
  // STOCK OUT
  // =====================================================

  const stockOut = transactions
    .filter((t) => t.type === "OUT")
    .reduce(
      (sum, t) =>
        sum + Number(t.quantity || 0),
      0
    );

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">

            <FaSyncAlt className="text-2xl animate-spin" />

          </div>

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading transactions...
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
      <div className="min-h-screen bg-white p-8">

        <div className="max-w-xl mx-auto bg-white border border-red-200 rounded-2xl p-10 text-center shadow-sm">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">

            <FaExchangeAlt className="text-2xl" />

          </div>

          <h2 className="text-xl font-bold text-slate-800 mt-5">
            Unable to load transactions
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            {error}
          </p>

          <button
            type="button"
            onClick={loadTransactions}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 mt-6 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition disabled:opacity-50"
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
    <div className="min-h-screen bg-white">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="bg-white border-b border-slate-200">

        <div className="w-full px-5 sm:px-6 lg:px-8 py-6">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">

                <FaExchangeAlt />

                Operations

              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mt-2">
                Stock Transactions
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Complete inventory movement history.
              </p>

            </div>

            {/* =================================================
                REFRESH BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={loadTransactions}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
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

      <main className="w-full px-5 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* =================================================
            STATS
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* TOTAL */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Transactions
            </p>

            <p className="text-3xl font-bold text-slate-900 mt-2">
              {transactions.length}
            </p>

          </div>

          {/* STOCK IN */}

          <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm">

            <div className="flex justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Stock In
                </p>

                <p className="text-3xl font-bold text-emerald-600 mt-2">
                  +{stockIn}
                </p>

              </div>

              <FaArrowDown className="text-emerald-500 text-xl" />

            </div>

          </div>

          {/* STOCK OUT */}

          <div className="bg-white border border-orange-200 rounded-2xl p-6 shadow-sm">

            <div className="flex justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Stock Out
                </p>

                <p className="text-3xl font-bold text-orange-600 mt-2">
                  -{stockOut}
                </p>

              </div>

              <FaArrowUp className="text-orange-500 text-xl" />

            </div>

          </div>

        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="mt-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <div className="flex flex-col lg:flex-row gap-4">

            {/* SEARCH */}

            <div className="relative flex-1">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search product or user..."
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
              />

            </div>

            {/* TYPE */}

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              className="lg:w-52 px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 outline-none focus:border-amber-500"
            >

              <option value="ALL">
                All Transactions
              </option>

              <option value="IN">
                Stock In
              </option>

              <option value="OUT">
                Stock Out
              </option>

            </select>

          </div>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="mt-5 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

          <div className="px-6 py-5 border-b border-slate-200">

            <h2 className="font-bold text-slate-900">
              Transaction History
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              {filteredTransactions.length} records displayed
            </p>

          </div>

          {filteredTransactions.length === 0 ? (

            <div className="p-16 text-center">

              <FaExchangeAlt className="mx-auto text-4xl text-slate-300" />

              <p className="font-semibold text-slate-600 mt-4">
                No transactions found
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Try changing your search or filter.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-400">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-400">
                      Type
                    </th>

                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-400">
                      Quantity
                    </th>

                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-400">
                      User
                    </th>

                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-400">
                      Note
                    </th>

                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-400">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredTransactions.map(
                    (transaction) => (

                      <tr
                        key={transaction._id}
                        className="hover:bg-slate-50 transition"
                      >

                        {/* PRODUCT */}

                        <td className="px-6 py-5">

                          <p className="font-semibold text-slate-800">
                            {transaction.product?.name ||
                              "Deleted Product"}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            {transaction.product?.category ||
                              "-"}
                          </p>

                        </td>

                        {/* TYPE */}

                        <td className="px-6 py-5">

                          {transaction.type ===
                          "IN" ? (

                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">

                              <FaArrowDown />

                              Stock In

                            </span>

                          ) : (

                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">

                              <FaArrowUp />

                              Stock Out

                            </span>

                          )}

                        </td>

                        {/* QUANTITY */}

                        <td className="px-6 py-5 font-bold text-slate-800">

                          {transaction.type ===
                          "IN"
                            ? "+"
                            : "-"}

                          {transaction.quantity}

                        </td>

                        {/* USER */}

                        <td className="px-6 py-5">

                          <p className="text-sm font-semibold text-slate-700">
                            {transaction.user?.name ||
                              "Unknown User"}
                          </p>

                          <p className="text-xs text-slate-400">
                            {transaction.user?.email ||
                              "-"}
                          </p>

                        </td>

                        {/* NOTE */}

                        <td className="px-6 py-5 text-sm text-slate-500">
                          {transaction.note || "-"}
                        </td>

                        {/* DATE */}

                        <td className="px-6 py-5 text-sm text-slate-500 whitespace-nowrap">

                          {formatDate(
                            transaction.createdAt
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

      </main>

    </div>
  );
}

export default AdminTransactions;