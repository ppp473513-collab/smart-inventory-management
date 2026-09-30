import { useEffect, useMemo, useState } from "react";

import {
  FaExclamationTriangle,
  FaBoxes,
  FaSearch,
  FaSyncAlt,
  FaTimesCircle,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

import api from "../services/api";

function AdminAlerts() {
  // =====================================================
  // STATE
  // =====================================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("ALL");

  const LOW_STOCK_LIMIT = 10;

  // =====================================================
  // LOAD INVENTORY ALERTS
  // =====================================================

  const loadAlerts = async () => {
    try {
      setError("");

      setRefreshing(true);

      const response = await api.get(
        "/admin/inventory-summary"
      );

      const data =
        response.data?.data || {};

      const allProducts = [
        ...(data.healthyProducts || []),
        ...(data.lowStockProducts || []),
        ...(data.criticalProducts || []),
      ];

      setProducts(allProducts);
    } catch (error) {
      console.error(
        "ADMIN ALERTS ERROR:",
        error.response?.data ||
        error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to load stock alerts."
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
    loadAlerts();
  }, []);

  // =====================================================
  // STATUS
  // =====================================================

  const getStatus = (quantity) => {
    const qty = Number(quantity || 0);

    if (qty === 0) {
      return "CRITICAL";
    }

    if (qty <= LOW_STOCK_LIMIT) {
      return "LOW";
    }

    return "HEALTHY";
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const statistics = useMemo(() => {
    const critical = products.filter(
      (product) =>
        getStatus(product.quantity) ===
        "CRITICAL"
    ).length;

    const low = products.filter(
      (product) =>
        getStatus(product.quantity) ===
        "LOW"
    ).length;

    const healthy = products.filter(
      (product) =>
        getStatus(product.quantity) ===
        "HEALTHY"
    ).length;

    return {
      critical,
      low,
      healthy,
      total: products.length,
    };
  }, [products]);

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {
    const text = search
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const status = getStatus(
        product.quantity
      );

      const name =
        product.name?.toLowerCase() || "";

      const category =
        product.category?.toLowerCase() || "";

      const matchesSearch =
        !text ||
        name.includes(text) ||
        category.includes(text);

      const matchesFilter =
        filter === "ALL" ||
        filter === status;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [products, search, filter]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">

            <FaSyncAlt className="text-2xl animate-spin" />

          </div>

          <p className="mt-5 text-sm font-semibold text-slate-600">
            Analyzing inventory...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Checking current stock levels
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
      <div className="min-h-screen bg-white p-6 lg:p-10">

        <div className="max-w-2xl mx-auto bg-white border border-red-200 rounded-2xl p-10 text-center shadow-sm">

          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">

            <FaExclamationTriangle className="text-2xl" />

          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-5">
            Unable to load stock intelligence
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            {error}
          </p>

          <button
            type="button"
            onClick={loadAlerts}
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition"
          >
            <FaSyncAlt />
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <div className="min-h-screen w-full bg-white">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="bg-white border-b border-slate-200">

        <div className="w-full px-5 sm:px-6 lg:px-8 py-6">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">

                <FaExclamationTriangle />

              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
                  Stock Intelligence
                </p>

                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mt-1">
                  Inventory Alerts
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Identify products requiring attention.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={loadAlerts}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaSyncAlt
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

          </div>

        </div>

      </header>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="w-full px-5 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* CRITICAL */}

          <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Critical
                </p>

                <p className="text-3xl font-bold text-red-600 mt-2">
                  {statistics.critical}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  Completely out of stock
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">

                <FaTimesCircle />

              </div>

            </div>

          </div>

          {/* LOW STOCK */}

          <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Low Stock
                </p>

                <p className="text-3xl font-bold text-amber-600 mt-2">
                  {statistics.low}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  {LOW_STOCK_LIMIT} units or less
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">

                <FaExclamationTriangle />

              </div>

            </div>

          </div>

          {/* HEALTHY */}

          <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Healthy
                </p>

                <p className="text-3xl font-bold text-emerald-600 mt-2">
                  {statistics.healthy}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  Normal stock levels
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">

                <FaCheckCircle />

              </div>

            </div>

          </div>

          {/* TOTAL */}

          <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-sm">

            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Products Monitored
            </p>

            <p className="text-3xl font-bold mt-2">
              {statistics.total}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              Current inventory
            </p>

          </div>

        </div>

        {/* =================================================
            ATTENTION BANNER
        ================================================= */}

        {(statistics.critical > 0 ||
          statistics.low > 0) && (

            <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">

              <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">

                <FaExclamationTriangle />

              </div>

              <div>

                <h2 className="font-bold text-red-800">
                  Inventory requires attention
                </h2>

                <p className="text-sm text-red-700 mt-1">
                  {statistics.critical} critical and{" "}
                  {statistics.low} low-stock products
                  require review.
                </p>

              </div>

            </div>
          )}

        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <div className="mt-7 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

          <div className="flex flex-col lg:flex-row gap-3">

            {/* SEARCH */}

            <div className="relative flex-1">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search product or category..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
              />

            </div>

            {/* FILTER */}

            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
              className="lg:w-56 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none focus:border-amber-500"
            >

              <option value="ALL">
                All Products
              </option>

              <option value="CRITICAL">
                Critical
              </option>

              <option value="LOW">
                Low Stock
              </option>

              <option value="HEALTHY">
                Healthy
              </option>

            </select>

          </div>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="mt-5 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

          <div className="px-5 sm:px-6 py-5 border-b border-slate-200 flex items-center justify-between">

            <div>

              <h2 className="font-bold text-slate-900">
                Stock Intelligence
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                {filteredProducts.length} products displayed
              </p>

            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">

              <FaBoxes />

              Live inventory monitoring

            </div>

          </div>

          {/* NO RESULTS */}

          {filteredProducts.length === 0 ? (

            <div className="p-16 text-center">

              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">

                <FaCheckCircle className="text-2xl" />

              </div>

              <p className="font-bold text-slate-700 mt-4">
                No matching alerts
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Inventory is currently under control.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px]">

                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Available
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredProducts.map(
                    (product) => {

                      const status =
                        getStatus(
                          product.quantity
                        );

                      return (
                        <tr
                          key={product._id}
                          className="hover:bg-slate-50 transition"
                        >

                          {/* PRODUCT */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">

                                <FaBoxes />

                              </div>

                              <div>

                                <p className="font-semibold text-slate-800">
                                  {product.name}
                                </p>

                                <p className="text-[11px] text-slate-400 mt-1">
                                  Inventory item
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* CATEGORY */}

                          <td className="px-6 py-5 text-sm text-slate-500">
                            {product.category ||
                              "Uncategorized"}
                          </td>

                          {/* QUANTITY */}

                          <td className="px-6 py-5">

                            <span className="font-bold text-slate-800">
                              {product.quantity}
                            </span>

                            <span className="text-xs text-slate-400 ml-1">
                              units
                            </span>

                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-5">

                            {status ===
                              "CRITICAL" && (

                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold">

                                  <FaTimesCircle />

                                  Critical

                                </span>

                              )}

                            {status ===
                              "LOW" && (

                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">

                                  <FaExclamationTriangle />

                                  Low Stock

                                </span>

                              )}

                            {status ===
                              "HEALTHY" && (

                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">

                                  <FaCheckCircle />

                                  Healthy

                                </span>

                              )}

                          </td>

                          {/* ACTION */}

                          <td className="px-6 py-5 text-right">

                            {status !==
                              "HEALTHY" ? (

                              <button
                                type="button"
                                onClick={() =>
                                  setFilter(
                                    status
                                  )
                                }
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-amber-500 transition"
                              >

                                Review

                                <FaArrowRight />

                              </button>

                            ) : (

                              <span className="text-xs text-slate-400">
                                No action
                              </span>

                            )}

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

      </main>

    </div>
  );
}

export default AdminAlerts;