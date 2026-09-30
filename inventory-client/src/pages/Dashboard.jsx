import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBox,
  FaBoxes,
  FaExclamationTriangle,
  FaTimesCircle,
  FaArrowDown,
  FaArrowUp,
  FaPlus,
  FaMinus,
  FaHistory,
  FaWarehouse,
  FaBell,
  FaSyncAlt,
} from "react-icons/fa";

import api from "../services/api";
import { useRegisterRefresh } from "../hooks/useRegisterRefresh";

function Dashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  const loadDashboard = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const [productsResponse, historyResponse] =
        await Promise.all([
          api.get("/products"),
          api.get("/stock/history"),
        ]);

      const productData = Array.isArray(
        productsResponse.data
      )
        ? productsResponse.data
        : productsResponse.data?.products || [];

      const historyData = Array.isArray(
        historyResponse.data
      )
        ? historyResponse.data
        : historyResponse.data?.transactions || [];

      setProducts(productData);
      setTransactions(historyData);
    } catch (error) {
      console.error(
        "DASHBOARD ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useRegisterRefresh(
    () => loadDashboard(false),
    [loadDashboard]
  );

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalProducts = products.length;

  const totalUnits = products.reduce(
    (total, product) =>
      total + Number(product.quantity || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) => {
      const quantity = Number(
        product.quantity || 0
      );

      return quantity > 0 && quantity <= 10;
    }
  );

  const outOfStockProducts = products.filter(
    (product) =>
      Number(product.quantity || 0) === 0
  );
const stockInTransactions = transactions.filter(
  (transaction) =>
    String(transaction.type || "")
      .trim()
      .toUpperCase() === "IN"
);

const stockOutTransactions = transactions.filter(
  (transaction) =>
    String(transaction.type || "")
      .trim()
      .toUpperCase() === "OUT"
);

const totalStockIn = stockInTransactions.reduce(
  (total, transaction) =>
    total + Number(transaction.quantity || 0),
  0
);

const totalStockOut = stockOutTransactions.reduce(
  (total, transaction) =>
    total + Number(transaction.quantity || 0),
  0
);
  const recentTransactions =
    transactions.slice(0, 5);

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================
  // STAT CARD
  // ==========================================

  const StatCard = ({
    title,
    value,
    icon,
    iconClass,
    onClick,
  }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full bg-white rounded-2xl border border-slate-200 p-5 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
      >
        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-slate-500">
              {title}
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-2">
              {loading ? "..." : value}
            </h2>
          </div>

          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconClass}`}
          >
            {icon}
          </div>

        </div>
      </button>
    );
  };

  // ==========================================
  // QUICK ACTION
  // ==========================================

  const QuickAction = ({
    title,
    description,
    icon,
    onClick,
  }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full bg-white border border-slate-200 rounded-2xl p-5 text-left hover:shadow-md hover:border-blue-200 transition"
      >
        <div className="flex items-center gap-4">

          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            {icon}
          </div>

          <div>
            <h3 className="font-semibold text-slate-800">
              {title}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {description}
            </p>
          </div>

        </div>
      </button>
    );
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <p className="text-blue-600 font-semibold">
            Inventory Overview
          </p>

          <h1 className="text-3xl font-bold text-slate-800 mt-1">
            Dashboard
          </h1>

          <p className="text-slate-500 mt-1">
            Monitor your inventory and stock activity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadDashboard(false)}
          disabled={refreshing}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        >
          <FaSyncAlt
            className={
              refreshing ? "animate-spin" : ""
            }
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>

      </div>

      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {/* =====================================
          STATISTICS
      ===================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={
            <FaBox className="text-xl text-blue-600" />
          }
          iconClass="bg-blue-50"
          onClick={() =>
            navigate("/products")
          }
        />

        <StatCard
          title="Total Units"
          value={totalUnits}
          icon={
            <FaBoxes className="text-xl text-purple-600" />
          }
          iconClass="bg-purple-50"
          onClick={() =>
            navigate("/products")
          }
        />

        <StatCard
          title="Low Stock"
          value={lowStockProducts.length}
          icon={
            <FaExclamationTriangle className="text-xl text-yellow-600" />
          }
          iconClass="bg-yellow-50"
          onClick={() =>
            navigate("/stock-alerts")
          }
        />

        <StatCard
          title="Out of Stock"
          value={outOfStockProducts.length}
          icon={
            <FaTimesCircle className="text-xl text-red-600" />
          }
          iconClass="bg-red-50"
          onClick={() =>
            navigate("/stock-alerts")
          }
        />

      </div>

      {/* =====================================
          STOCK IN / OUT
      ===================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

        <button
          type="button"
          onClick={() =>
            navigate("/stock-in")
          }
          className="bg-white rounded-2xl border border-slate-200 p-6 text-left hover:shadow-md transition"
        >
          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <FaArrowDown />
            </div>

            <div>
              <p className="text-slate-500">
                Total Stock In
              </p>

              <h2 className="text-2xl font-bold text-slate-800">
                {loading
                  ? "..."
                  : stockInTransactions.length}
              </h2>
            </div>

          </div>
        </button>

        <button
          type="button"
          onClick={() =>
            navigate("/stock-out")
          }
          className="bg-white rounded-2xl border border-slate-200 p-6 text-left hover:shadow-md transition"
        >
          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <FaArrowUp />
            </div>

            <div>
              <p className="text-slate-500">
                Total Stock Out
              </p>

              <h2 className="text-2xl font-bold text-slate-800">
                {loading
                  ? "..."
                  : stockOutTransactions.length}
              </h2>
            </div>

          </div>
        </button>

      </div>

      {/* =====================================
          QUICK ACTIONS
      ===================================== */}

      <div className="mb-8">

        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          <QuickAction
            title="Products"
            description="View and manage products"
            icon={<FaBox />}
            onClick={() =>
              navigate("/products")
            }
          />

          <QuickAction
            title="Stock In"
            description="Add new stock"
            icon={<FaPlus />}
            onClick={() =>
              navigate("/stock-in")
            }
          />

          <QuickAction
            title="Stock Out"
            description="Remove stock"
            icon={<FaMinus />}
            onClick={() =>
              navigate("/stock-out")
            }
          />

          <QuickAction
            title="Transactions"
            description="View stock history"
            icon={<FaHistory />}
            onClick={() =>
              navigate("/transactions")
            }
          />

        </div>

      </div>

      {/* =====================================
          RECENT TRANSACTIONS
      ===================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">

        <div className="p-5 border-b border-slate-200 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FaHistory />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">
                Recent Transactions
              </h2>

              <p className="text-sm text-slate-500">
                Latest stock activity
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/transactions")
            }
            className="text-blue-600 font-semibold hover:text-blue-700"
          >
            View All
          </button>

        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading transactions...
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="p-10 text-center">

            <FaHistory className="mx-auto text-3xl text-slate-300 mb-3" />

            <p className="font-semibold text-slate-600">
              No transactions yet
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="bg-slate-50 text-left">

                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                    Product
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                    Type
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                    Quantity
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                    Date
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {recentTransactions.map(
                  (transaction, index) => {

                    const isIn =
                      transaction.type === "IN";

                    return (
                      <tr
                        key={
                          transaction._id ||
                          index
                        }
                        className="hover:bg-slate-50"
                      >

                        <td className="px-5 py-4">

                          <p className="font-semibold text-slate-700">
                            {transaction.product
                              ?.name ||
                              "Unknown Product"}
                          </p>

                          <p className="text-xs text-slate-400">
                            {transaction.product
                              ?.category || ""}
                          </p>

                        </td>

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                              isIn
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {isIn ? (
                              <FaArrowDown />
                            ) : (
                              <FaArrowUp />
                            )}

                            {isIn
                              ? "Stock In"
                              : "Stock Out"}
                          </span>

                        </td>

                        <td className="px-5 py-4 font-semibold">
                          {transaction.quantity}
                        </td>

                        <td className="px-5 py-4">

                          <p className="text-sm text-slate-700">
                            {formatDate(
                              transaction.createdAt
                            )}
                          </p>

                          <p className="text-xs text-slate-400">
                            {formatTime(
                              transaction.createdAt
                            )}
                          </p>

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

      {/* =====================================
          STOCK ALERTS
      ===================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-5 border-b border-slate-200 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <FaBell />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">
                Stock Alerts
              </h2>

              <p className="text-sm text-slate-500">
                Products needing attention
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/stock-alerts")
            }
            className="text-blue-600 font-semibold"
          >
            View All
          </button>

        </div>

        {lowStockProducts.length === 0 &&
        outOfStockProducts.length === 0 ? (
          <div className="p-10 text-center">

            <FaWarehouse className="mx-auto text-3xl text-green-500 mb-3" />

            <p className="font-semibold text-slate-700">
              All Good
            </p>

            <p className="text-sm text-slate-400">
              No stock alerts.
            </p>

          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {[
              ...outOfStockProducts,
              ...lowStockProducts,
            ]
              .slice(0, 5)
              .map((product) => {

                const quantity = Number(
                  product.quantity || 0
                );

                const isOut =
                  quantity === 0;

                return (
                  <div
                    key={product._id}
                    className="p-5 flex items-center justify-between"
                  >

                    <div className="flex items-center gap-3">

                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isOut
                            ? "bg-red-50 text-red-600"
                            : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        {isOut ? (
                          <FaTimesCircle />
                        ) : (
                          <FaExclamationTriangle />
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-700">
                          {product.name}
                        </p>

                        <p className="text-sm text-slate-400">
                          {product.category ||
                            "No category"}
                        </p>
                      </div>

                    </div>

                    <div className="text-right">

                      <p
                        className={`font-bold ${
                          isOut
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {quantity} units
                      </p>

                      <p className="text-xs text-slate-400">
                        {isOut
                          ? "Out of stock"
                          : "Low stock"}
                      </p>

                    </div>

                  </div>
                );
              })}

          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;