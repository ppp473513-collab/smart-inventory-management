import { useEffect, useMemo, useState } from "react";

import {
  FaChartLine,
  FaBoxes,
  FaArrowDown,
  FaArrowUp,
  FaRupeeSign,
  FaSyncAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

import api from "../services/api";

function AdminAnalytics() {
  // =====================================================
  // STATE
  // =====================================================

  const [products, setProducts] = useState([]);

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD ANALYTICS DATA
  // =====================================================

  const loadAnalytics = async () => {
    try {
      setRefreshing(true);
      setError("");

      const [
        inventoryResponse,
        dashboardResponse,
      ] = await Promise.all([
        api.get("/admin/inventory-summary"),
        api.get("/admin/dashboard"),
      ]);

      const inventory =
        inventoryResponse.data?.data || {};

      const dashboard =
        dashboardResponse.data?.data || {};

      const allProducts = [
        ...(inventory.healthyProducts || []),
        ...(inventory.lowStockProducts || []),
        ...(inventory.criticalProducts || []),
      ];

      setProducts(allProducts);

      setTransactions(
        dashboard.recentTransactions || []
      );
    } catch (error) {
      console.error(
        "ADMIN ANALYTICS ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load analytics"
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
    loadAnalytics();
  }, []);

  // =====================================================
  // PRODUCT ANALYTICS
  // =====================================================

  const analytics = useMemo(() => {
    let totalUnits = 0;
    let inventoryValue = 0;

    let stockIn = 0;
    let stockOut = 0;

    products.forEach((product) => {
      const quantity =
        Number(product.quantity || 0);

      const price =
        Number(product.price || 0);

      totalUnits += quantity;

      inventoryValue +=
        quantity * price;
    });

    transactions.forEach(
      (transaction) => {
        const quantity =
          Number(
            transaction.quantity || 0
          );

        if (
          transaction.type === "IN"
        ) {
          stockIn += quantity;
        }

        if (
          transaction.type === "OUT"
        ) {
          stockOut += quantity;
        }
      }
    );

    const categories = {};

    products.forEach((product) => {
      const category =
        product.category ||
        "Uncategorized";

      if (!categories[category]) {
        categories[category] = {
          products: 0,
          units: 0,
          value: 0,
        };
      }

      categories[category].products += 1;

      categories[category].units +=
        Number(product.quantity || 0);

      categories[category].value +=
        Number(product.quantity || 0) *
        Number(product.price || 0);
    });

    return {
      totalUnits,
      inventoryValue,
      stockIn,
      stockOut,
      categories,
    };
  }, [products, transactions]);

  // =====================================================
  // TOP PRODUCTS
  // =====================================================

  const topProducts = useMemo(() => {
    return [...products]
      .sort(
        (a, b) =>
          Number(b.quantity || 0) -
          Number(a.quantity || 0)
      )
      .slice(0, 5);
  }, [products]);

  // =====================================================
  // CATEGORY DATA
  // =====================================================

  const categoryData = Object.entries(
    analytics.categories
  ).sort(
    ([, a], [, b]) =>
      b.value - a.value
  );

  // =====================================================
  // MONEY FORMAT
  // =====================================================

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

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

          <p className="text-sm font-semibold text-slate-600 mt-4">
            Generating analytics...
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Processing inventory data
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

          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">

            <FaExclamationTriangle className="text-2xl" />

          </div>

          <h2 className="text-xl font-bold text-slate-800 mt-5">
            Analytics unavailable
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            {error}
          </p>

          <button
            type="button"
            onClick={loadAnalytics}
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
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-white">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="bg-white border-b border-slate-200">

        <div className="w-full px-5 sm:px-6 lg:px-8 py-6">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            {/* TITLE */}

            <div>

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">

                <FaChartLine />

                Business Intelligence

              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mt-2">
                Analytics
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Understand inventory value, stock movement and product performance.
              </p>

            </div>

            {/* REFRESH */}

            <button
              type="button"
              onClick={loadAnalytics}
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
          CONTENT
      ================================================= */}

      <main className="w-full px-5 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* =================================================
            KPI CARDS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {/* INVENTORY VALUE */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <div className="flex justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Inventory Value
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {formatMoney(
                    analytics.inventoryValue
                  )}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">

                <FaRupeeSign />

              </div>

            </div>

          </div>

          {/* CURRENT UNITS */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <div className="flex justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Current Units
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {analytics.totalUnits}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">

                <FaBoxes />

              </div>

            </div>

          </div>

          {/* STOCK IN */}

          <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm">

            <div className="flex justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Recent Stock In
                </p>

                <p className="text-3xl font-bold text-emerald-600 mt-2">
                  +{analytics.stockIn}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">

                <FaArrowDown />

              </div>

            </div>

          </div>

          {/* STOCK OUT */}

          <div className="bg-white border border-orange-200 rounded-2xl p-6 shadow-sm">

            <div className="flex justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Recent Stock Out
                </p>

                <p className="text-3xl font-bold text-orange-600 mt-2">
                  -{analytics.stockOut}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">

                <FaArrowUp />

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            MAIN ANALYTICS
        ================================================= */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-7">

          {/* TOP PRODUCTS */}

          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

            <div className="px-6 py-5 border-b border-slate-200">

              <h2 className="font-bold text-slate-900">
                Top Products by Stock
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Products with the highest current quantity
              </p>

            </div>

            <div className="p-6 space-y-5">

              {topProducts.length === 0 ? (

                <p className="text-center text-sm text-slate-400 py-10">
                  No products available.
                </p>

              ) : (

                topProducts.map(
                  (product, index) => {

                    const maxQuantity =
                      Math.max(
                        ...topProducts.map(
                          (item) =>
                            Number(
                              item.quantity || 0
                            )
                        ),
                        1
                      );

                    const percentage =
                      (Number(
                        product.quantity || 0
                      ) /
                        maxQuantity) *
                      100;

                    return (
                      <div
                        key={product._id}
                      >

                        <div className="flex justify-between mb-2">

                          <div>

                            <p className="text-sm font-semibold text-slate-800">
                              {index + 1}.{" "}
                              {product.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              {product.category ||
                                "Uncategorized"}
                            </p>

                          </div>

                          <span className="text-sm font-bold text-slate-700">
                            {product.quantity}
                          </span>

                        </div>

                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />

                        </div>

                      </div>
                    );
                  }
                )

              )}

            </div>

          </section>

          {/* CATEGORY ANALYSIS */}

          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

            <div className="px-6 py-5 border-b border-slate-200">

              <h2 className="font-bold text-slate-900">
                Category Performance
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Inventory distribution by category
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-400">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-400">
                      Products
                    </th>

                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-400">
                      Units
                    </th>

                    <th className="px-6 py-4 text-right text-xs uppercase tracking-wide text-slate-400">
                      Value
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {categoryData.length === 0 ? (

                    <tr>

                      <td
                        colSpan="4"
                        className="px-6 py-10 text-center text-sm text-slate-400"
                      >
                        No category data available.
                      </td>

                    </tr>

                  ) : (

                    categoryData.map(
                      ([category, data]) => (

                        <tr
                          key={category}
                          className="hover:bg-slate-50"
                        >

                          <td className="px-6 py-4">

                            <p className="font-semibold text-slate-800">
                              {category}
                            </p>

                          </td>

                          <td className="px-6 py-4 text-sm text-slate-500">
                            {data.products}
                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                            {data.units}
                          </td>

                          <td className="px-6 py-4 text-right text-sm font-bold text-slate-700">
                            {formatMoney(
                              data.value
                            )}
                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </section>

        </div>

        {/* =================================================
            STOCK MOVEMENT
        ================================================= */}

        <section className="mt-7 bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">

              <FaChartLine />

            </div>

            <div>

              <h2 className="font-bold text-slate-900">
                Stock Movement Overview
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Recent inventory movement recorded by the system
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-7">

            {/* STOCK ADDED */}

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">

              <p className="text-xs text-slate-500">
                Stock Added
              </p>

              <p className="text-3xl font-bold text-emerald-600 mt-2">
                +{analytics.stockIn}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Units
              </p>

            </div>

            {/* STOCK REMOVED */}

            <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">

              <p className="text-xs text-slate-500">
                Stock Removed
              </p>

              <p className="text-3xl font-bold text-orange-600 mt-2">
                -{analytics.stockOut}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Units
              </p>

            </div>

            {/* NET */}

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">

              <p className="text-xs text-slate-500">
                Net Movement
              </p>

              <p className="text-3xl font-bold text-amber-600 mt-2">

                {analytics.stockIn -
                  analytics.stockOut >=
                0
                  ? "+"
                  : ""}

                {analytics.stockIn -
                  analytics.stockOut}

              </p>

              <p className="text-xs text-slate-400 mt-1">
                Units
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminAnalytics;