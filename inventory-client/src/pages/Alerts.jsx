import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaBoxes,
  FaExclamationTriangle,
  FaArrowDown,
  FaEdit,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";

import api from "../services/api";
import Loader from "../components/Loader";
import { useRegisterRefresh } from "../hooks/useRegisterRefresh";

function Alerts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await api.get("/products");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.products || [];

      setProducts(data);
    } catch (error) {
      console.error(
        "Failed to load alerts:",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useRegisterRefresh(
    () => fetchProducts(false),
    [fetchProducts]
  );

  // =========================================
  // ALERT PRODUCTS
  // =========================================

  const alertProducts = products.filter(
    (product) =>
      Number(product.quantity || 0) <= 10
  );

  const outOfStock = alertProducts.filter(
    (product) =>
      Number(product.quantity || 0) === 0
  );

  const lowStock = alertProducts.filter(
    (product) =>
      Number(product.quantity || 0) > 0 &&
      Number(product.quantity || 0) <= 10
  );

  // =========================================
  // SEARCH
  // =========================================

  const filteredAlerts = alertProducts.filter(
    (product) =>
      product.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      product.category
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // =========================================
  // STATUS
  // =========================================

  const getStatus = (quantity) => {
    const qty = Number(quantity || 0);

    if (qty === 0) {
      return "Out of Stock";
    }

    return "Low Stock";
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="p-5 sm:p-6 lg:p-8">

          {/* HEADER */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">

            <div>

              <p className="text-sm font-semibold text-red-500">
                Inventory Monitoring
              </p>

              <h1 className="text-3xl font-bold text-slate-800 mt-1">
                Stock Alerts
              </h1>

              <p className="text-slate-500 mt-2">
                Products that need your attention.
              </p>

            </div>

            <button
              type="button"
              onClick={() => fetchProducts(false)}
              disabled={refreshing}
              className="w-fit flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition disabled:opacity-60"
            >
              <FaSyncAlt
                className={
                  refreshing ? "animate-spin" : ""
                }
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

          </div>

          {/* SUMMARY CARDS */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">

            {/* TOTAL */}

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Total Alerts
                  </p>

                  <p className="text-3xl font-bold text-slate-800 mt-2">
                    {alertProducts.length}
                  </p>

                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FaBell />
                </div>

              </div>

            </div>

            {/* LOW STOCK */}

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Low Stock
                  </p>

                  <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {lowStock.length}
                  </p>

                </div>

                <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                  <FaExclamationTriangle />
                </div>

              </div>

            </div>

            {/* OUT OF STOCK */}

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Out of Stock
                  </p>

                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {outOfStock.length}
                  </p>

                </div>

                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <FaBoxes />
                </div>

              </div>

            </div>

          </div>

          {/* SEARCH */}

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">

            <div className="relative">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search alert products..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>

          </div>

          {/* ALERT LIST */}

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="text-lg font-bold text-slate-800">
                Products Requiring Attention
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {filteredAlerts.length} products
                need attention.
              </p>

            </div>

            {loading ? (

              <div className="p-10">
                <Loader text="Loading alerts..." />
              </div>

            ) : filteredAlerts.length === 0 ? (

              <div className="p-16 text-center">

                <div className="w-16 h-16 mx-auto rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-4">

                  ✓

                </div>

                <h3 className="font-bold text-slate-700">
                  No Stock Alerts
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  All your products have sufficient stock.
                </p>

              </div>

            ) : (

              <div className="divide-y">

                {filteredAlerts.map(
                  (product) => {

                    const quantity =
                      Number(product.quantity || 0);

                    const out =
                      quantity === 0;

                    const status =
                      getStatus(quantity);

                    return (
                      <div
                        key={product._id}
                        className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 hover:bg-slate-50 transition"
                      >

                        {/* PRODUCT */}

                        <div className="flex items-center gap-4 min-w-0">

                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                              out
                                ? "bg-red-50 text-red-600"
                                : "bg-yellow-50 text-yellow-600"
                            }`}
                          >

                            <FaExclamationTriangle />

                          </div>

                          <div className="min-w-0">

                            <p className="font-bold text-slate-800 truncate">
                              {product.name}
                            </p>

                            <p className="text-sm text-slate-400 mt-1">
                              {product.category ||
                                "Uncategorized"}
                            </p>

                          </div>

                        </div>

                        {/* STOCK */}

                        <div>

                          <p className="text-xs text-slate-400 mb-1">
                            Current Stock
                          </p>

                          <p
                            className={`text-xl font-bold ${
                              out
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {quantity}
                            <span className="text-xs font-normal text-slate-400 ml-1">
                              units
                            </span>
                          </p>

                        </div>

                        {/* STATUS */}

                        <div>

                          <span
                            className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${
                              out
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {status}
                          </span>

                        </div>

                        {/* ACTIONS */}

                        <div className="flex items-center gap-2">

                          {/* STOCK IN */}

                          <button
                            onClick={() =>
                              navigate(
                                `/products/stock-in/${product._id}`
                              )
                            }
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 font-semibold text-sm"
                          >

                            <FaArrowDown />

                            Stock In

                          </button>

                          {/* EDIT */}

                          <button
                            onClick={() =>
                              navigate(
                                `/products/edit/${product._id}`
                              )
                            }
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-sm"
                          >

                            <FaEdit />

                            Edit

                          </button>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            )}

          </div>

    </div>
  );
}

export default Alerts;