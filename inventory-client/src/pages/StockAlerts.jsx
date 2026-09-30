import { useCallback, useEffect, useState } from "react";
import {
  FaExclamationTriangle,
  FaBoxOpen,
  FaBoxes,
  FaEdit,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Loader from "../components/Loader";
import { useRegisterRefresh } from "../hooks/useRegisterRefresh";

function StockAlerts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

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
        : response.data?.products || [];

      setProducts(data);
    } catch (error) {
      console.error(
        "STOCK ALERTS ERROR:",
        error.response?.data || error.message
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

  const alertProducts = products
    .filter((product) => {
      const quantity = Number(product.quantity || 0);

      return quantity <= 10;
    })
    .filter((product) =>
      product.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort(
      (a, b) =>
        Number(a.quantity || 0) -
        Number(b.quantity || 0)
    );

  const outOfStock = alertProducts.filter(
    (product) =>
      Number(product.quantity || 0) === 0
  );

  const lowStock = alertProducts.filter(
    (product) => {
      const quantity = Number(product.quantity || 0);

      return quantity > 0 && quantity <= 10;
    }
  );

  return (
    <div className="p-5 sm:p-6 lg:p-8">

          {/* HEADER */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

            <div>
              <p className="text-sm font-semibold text-red-600">
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

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>

          {loading ? (

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12">
              <Loader text="Loading stock alerts..." />
            </div>

          ) : (

            <>

              {/* SUMMARY */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">

                {/* TOTAL ALERTS */}

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

                    <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                      <FaExclamationTriangle />
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
                      <FaBoxes />
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
                      <FaBoxOpen />
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
                    placeholder="Search products..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>

              </div>

              {/* ALERT LIST */}

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                <div className="px-6 py-5 border-b border-slate-100">

                  <h2 className="text-lg font-bold text-slate-800">
                    Products Requiring Attention
                  </h2>

                  <p className="text-sm text-slate-400 mt-1">
                    Stock level is 10 units or below.
                  </p>

                </div>

                {alertProducts.length === 0 ? (

                  <div className="p-16 text-center">

                    <div className="w-16 h-16 mx-auto rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                      ✓
                    </div>

                    <h3 className="font-bold text-slate-700">
                      No Stock Alerts
                    </h3>

                    <p className="text-sm text-slate-400 mt-1">
                      All your products have healthy
                      stock levels.
                    </p>

                  </div>

                ) : (

                  <div className="divide-y divide-slate-100">

                    {alertProducts.map(
                      (product) => {

                        const quantity =
                          Number(
                            product.quantity || 0
                          );

                        const isOut =
                          quantity === 0;

                        return (
                          <div
                            key={product._id}
                            className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center gap-5 hover:bg-slate-50 transition"
                          >

                            {/* PRODUCT */}

                            <div className="flex items-center gap-4 flex-1 min-w-0">

                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                  isOut
                                    ? "bg-red-50 text-red-600"
                                    : "bg-yellow-50 text-yellow-600"
                                }`}
                              >
                                {isOut ? (
                                  <FaBoxOpen />
                                ) : (
                                  <FaExclamationTriangle />
                                )}
                              </div>

                              <div className="min-w-0">

                                <h3 className="font-bold text-slate-800 truncate">
                                  {product.name}
                                </h3>

                                <p className="text-sm text-slate-400 mt-1">
                                  {product.category ||
                                    "Uncategorized"}
                                </p>

                              </div>

                            </div>

                            {/* QUANTITY */}

                            <div className="lg:w-40">

                              <p className="text-xs text-slate-400">
                                Current Stock
                              </p>

                              <p
                                className={`text-xl font-bold mt-1 ${
                                  isOut
                                    ? "text-red-600"
                                    : "text-yellow-600"
                                }`}
                              >
                                {quantity}
                                <span className="text-sm font-medium text-slate-400 ml-1">
                                  units
                                </span>
                              </p>

                            </div>

                            {/* STATUS */}

                            <div className="lg:w-36">

                              <span
                                className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${
                                  isOut
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {isOut
                                  ? "OUT OF STOCK"
                                  : "LOW STOCK"}
                              </span>

                            </div>

                            {/* ACTION */}

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/products/edit/${product._id}`
                                )
                              }
                              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition"
                            >
                              <FaEdit />
                              Update Stock
                            </button>

                          </div>
                        );
                      }
                    )}

                  </div>

                )}

              </div>

            </>

          )}

    </div>
  );
}

export default StockAlerts;