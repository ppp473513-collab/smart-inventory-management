import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaBoxes,
  FaUsers,
  FaRupeeSign,
  FaExclamationTriangle,
  FaTimesCircle,
  FaCheckCircle,
  FaHistory,
  FaChartLine,
  FaShieldAlt,
  FaSyncAlt,
} from "react-icons/fa";

import api from "../services/api";

function AdminDashboard() {
  // =====================================================
  // STATE
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [products, setProducts] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    units: 0,
    value: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = async (
    showLoader = true
  ) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setRefreshing(true);

      const [
        usersResponse,
        productsResponse,
      ] = await Promise.all([
        api.get("/users"),
        api.get("/products"),
      ]);

      const usersData =
        Array.isArray(usersResponse.data)
          ? usersResponse.data
          : usersResponse.data?.users || [];

      const productsData =
        Array.isArray(
          productsResponse.data
        )
          ? productsResponse.data
          : productsResponse.data?.products ||
            [];

      let units = 0;
      let value = 0;
      let lowStock = 0;
      let outOfStock = 0;

      productsData.forEach((product) => {
        const quantity = Number(
          product.quantity || 0
        );

        const price = Number(
          product.price || 0
        );

        units += quantity;
        value += quantity * price;

        if (quantity === 0) {
          outOfStock += 1;
        } else if (quantity <= 10) {
          lowStock += 1;
        }
      });

      setUsers(usersData);
      setProducts(productsData);

      setStats({
        users: usersData.length,
        products: productsData.length,
        units,
        value,
        lowStock,
        outOfStock,
      });
    } catch (error) {
      console.error(
        "ADMIN DASHBOARD ERROR:",
        error.response?.data ||
          error.message
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
    loadData(true);
  }, []);

  // =====================================================
  // INVENTORY HEALTH
  // =====================================================

  const health = useMemo(() => {
    if (stats.products === 0) {
      return 100;
    }

    const criticalPenalty =
      (stats.outOfStock /
        stats.products) *
      60;

    const lowPenalty =
      (stats.lowStock /
        stats.products) *
      40;

    return Math.max(
      0,
      Math.round(
        100 -
          criticalPenalty -
          lowPenalty
      )
    );
  }, [stats]);

  // =====================================================
  // CATEGORY DATA
  // =====================================================

  const categoryData = useMemo(() => {
    const map = {};

    products.forEach((product) => {
      const category =
        product.category?.trim() ||
        "Uncategorized";

      if (!map[category]) {
        map[category] = {
          units: 0,
          products: 0,
        };
      }

      map[category].products += 1;

      map[category].units += Number(
        product.quantity || 0
      );
    });

    return Object.entries(map)
      .map(([name, data]) => ({
        name,
        ...data,
      }))
      .sort(
        (a, b) =>
          b.units - a.units
      )
      .slice(0, 5);
  }, [products]);

  // =====================================================
  // PRODUCTS NEEDING ATTENTION
  // =====================================================

  const attentionProducts = useMemo(() => {
    return [...products]
      .filter(
        (product) =>
          Number(
            product.quantity || 0
          ) <= 10
      )
      .sort(
        (a, b) =>
          Number(a.quantity || 0) -
          Number(b.quantity || 0)
      )
      .slice(0, 6);
  }, [products]);

  // =====================================================
  // STOCK STATUS
  // =====================================================

  const getStockStatus = (
    quantity
  ) => {
    const qty = Number(
      quantity || 0
    );

    if (qty === 0) {
      return {
        label: "Critical",
        className:
          "bg-red-50 text-red-700 border-red-200",
      };
    }

    if (qty <= 10) {
      return {
        label: "Low Stock",
        className:
          "bg-amber-50 text-amber-700 border-amber-200",
      };
    }

    return {
      label: "Healthy",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  };

  // =====================================================
  // SYSTEM ACTIVITY
  // =====================================================

  const activity = useMemo(() => {
    const items = [];

    if (products.length > 0) {
      items.push({
        title: `${products.length} products currently tracked`,
        time: "Inventory",
        icon: FaBoxes,
      });
    }

    if (stats.lowStock > 0) {
      items.push({
        title: `${stats.lowStock} product${
          stats.lowStock > 1
            ? "s"
            : ""
        } require stock attention`,
        time: "Stock monitoring",
        icon: FaExclamationTriangle,
      });
    }

    if (stats.outOfStock > 0) {
      items.push({
        title: `${stats.outOfStock} product${
          stats.outOfStock > 1
            ? "s"
            : ""
        } are out of stock`,
        time: "Critical",
        icon: FaTimesCircle,
      });
    }

    if (users.length > 0) {
      items.push({
        title: `${users.length} registered users`,
        time: "User management",
        icon: FaUsers,
      });
    }

    items.push({
      title:
        "Administrator access verified",
      time: "Security",
      icon: FaShieldAlt,
    });

    return items.slice(0, 5);
  }, [
    products,
    users,
    stats,
  ]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen w-full max-w-full min-w-0 bg-white text-slate-900 overflow-x-hidden">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="w-full bg-white border-b border-slate-200">

        <div className="w-full max-w-full min-w-0 px-4 sm:px-6 lg:px-8 xl:px-10 py-5">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* TITLE */}

            <div className="min-w-0">

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600">

                <FaShieldAlt />

                <span>
                  Administration
                </span>

              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 break-words">
                Inventory Operations
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Monitor inventory, users and system activity from one place.
              </p>

            </div>

            {/* HEADER ACTIONS */}

            <div className="flex items-center">

              <button
                type="button"
                onClick={() =>
                  loadData(false)
                }
                disabled={refreshing}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  border
                  border-amber-200
                  bg-amber-500
                  text-white
                  text-sm
                  font-semibold
                  hover:bg-amber-600
                  transition
                  disabled:opacity-60
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

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="w-full max-w-full min-w-0 px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-8">

        {/* =================================================
            KPI CARDS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">

          {/* USERS */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm min-w-0">

            <div className="flex items-center justify-between gap-4">

              <div className="min-w-0">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Users
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {loading
                    ? "..."
                    : stats.users}
                </p>

                <p className="text-xs text-blue-600 mt-2 font-semibold">
                  Registered accounts
                </p>

              </div>

              <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FaUsers />
              </div>

            </div>

          </div>

          {/* PRODUCTS */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm min-w-0">

            <div className="flex items-center justify-between gap-4">

              <div className="min-w-0">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Products
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {loading
                    ? "..."
                    : stats.products}
                </p>

                <p className="text-xs text-emerald-600 mt-2 font-semibold">
                  Inventory items
                </p>

              </div>

              <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FaBoxes />
              </div>

            </div>

          </div>

          {/* UNITS */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm min-w-0">

            <div className="flex items-center justify-between gap-4">

              <div className="min-w-0">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Available Units
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {loading
                    ? "..."
                    : stats.units.toLocaleString(
                        "en-IN"
                      )}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  Current physical stock
                </p>

              </div>

              <div className="w-11 h-11 shrink-0 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <FaChartLine />
              </div>

            </div>

          </div>

          {/* VALUE */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm min-w-0">

            <div className="flex items-center justify-between gap-4">

              <div className="min-w-0">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Inventory Value
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-2 break-words">

                  ₹
                  {loading
                    ? "..."
                    : stats.value.toLocaleString(
                        "en-IN"
                      )}

                </p>

                <p className="text-xs text-slate-400 mt-2">
                  Current stock valuation
                </p>

              </div>

              <div className="w-11 h-11 shrink-0 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FaRupeeSign />
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            ALERT SUMMARY
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">

          <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Low Stock
                </p>

                <p className="text-3xl font-bold text-amber-600 mt-2">
                  {loading
                    ? "..."
                    : stats.lowStock}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  Products with 10 units or less
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FaExclamationTriangle />
              </div>

            </div>

          </div>

          <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Out of Stock
                </p>

                <p className="text-3xl font-bold text-red-600 mt-2">
                  {loading
                    ? "..."
                    : stats.outOfStock}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  Products with zero units
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <FaTimesCircle />
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            INVENTORY + HEALTH
        ================================================= */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-7">

          {/* CATEGORY */}

          <section className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden min-w-0">

            <div className="p-5 sm:p-6 border-b border-slate-200">

              <h2 className="font-bold text-slate-900">
                Inventory Overview
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Current stock distribution by category
              </p>

            </div>

            <div className="p-5 sm:p-6">

              {categoryData.length ===
              0 ? (

                <div className="py-12 text-center text-slate-400">
                  No category data available.
                </div>

              ) : (

                <div className="space-y-6">

                  {categoryData.map(
                    (category) => {

                      const maxUnits =
                        categoryData[0]
                          ?.units || 1;

                      const percentage =
                        Math.min(
                          100,
                          Math.round(
                            (category.units /
                              maxUnits) *
                              100
                          )
                        );

                      return (
                        <div
                          key={
                            category.name
                          }
                        >

                          <div className="flex items-center justify-between gap-4 mb-2">

                            <div className="min-w-0">

                              <p className="text-sm font-semibold text-slate-700 truncate">
                                {category.name}
                              </p>

                              <p className="text-xs text-slate-400">
                                {
                                  category.products
                                }{" "}
                                product
                                {category.products !==
                                1
                                  ? "s"
                                  : ""}
                              </p>

                            </div>

                            <p className="text-sm font-bold text-slate-800 whitespace-nowrap">
                              {
                                category.units
                              }{" "}
                              units
                            </p>

                          </div>

                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                            <div
                              className="h-full bg-amber-500 rounded-full transition-all duration-700"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              )}

            </div>

          </section>

          {/* STOCK HEALTH */}

          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden min-w-0">

            <div className="p-5 sm:p-6 border-b border-slate-200">

              <h2 className="font-bold text-slate-900">
                Stock Health
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Current inventory condition
              </p>

            </div>

            <div className="p-5 sm:p-6">

              <div className="flex justify-center py-3">

                <div className="relative w-36 h-36 sm:w-40 sm:h-40">

                  <svg
                    viewBox="0 0 160 160"
                    className="w-full h-full -rotate-90"
                  >

                    <circle
                      cx="80"
                      cy="80"
                      r="62"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="14"
                    />

                    <circle
                      cx="80"
                      cy="80"
                      r="62"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray="390"
                      strokeDashoffset={
                        390 -
                        (390 * health) /
                          100
                      }
                    />

                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">

                    <span className="text-3xl font-bold text-slate-900">
                      {health}%
                    </span>

                    <span className="text-xs text-slate-400">
                      Healthy
                    </span>

                  </div>

                </div>

              </div>

              <div className="space-y-3 mt-4">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />

                    <span className="text-sm text-slate-600">
                      Healthy
                    </span>

                  </div>

                  <span className="text-sm font-bold text-slate-800">
                    {Math.max(
                      0,
                      stats.products -
                        stats.lowStock -
                        stats.outOfStock
                    )}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />

                    <span className="text-sm text-slate-600">
                      Low Stock
                    </span>

                  </div>

                  <span className="text-sm font-bold text-slate-800">
                    {stats.lowStock}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />

                    <span className="text-sm text-slate-600">
                      Out of Stock
                    </span>

                  </div>

                  <span className="text-sm font-bold text-slate-800">
                    {stats.outOfStock}
                  </span>

                </div>

              </div>

            </div>

          </section>

        </div>

        {/* =================================================
            ATTENTION + ACTIVITY
        ================================================= */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-7">

          {/* ATTENTION */}

          <section className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden min-w-0">

            <div className="p-5 sm:p-6 border-b border-slate-200">

              <h2 className="font-bold text-slate-900">
                Critical Attention
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Products requiring administrator review
              </p>

            </div>

            {attentionProducts.length ===
            0 ? (

              <div className="p-10 text-center">

                <FaCheckCircle className="mx-auto text-3xl text-emerald-500" />

                <p className="font-semibold text-slate-700 mt-3">
                  No inventory issues
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  All products are above the alert threshold.
                </p>

              </div>

            ) : (

              <div className="w-full overflow-x-auto">

                <table className="w-full min-w-[650px]">

                  <thead className="bg-slate-50 border-b border-slate-200">

                    <tr>

                      <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wide text-slate-400">
                        Product
                      </th>

                      <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wide text-slate-400">
                        Category
                      </th>

                      <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wide text-slate-400">
                        Stock
                      </th>

                      <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wide text-slate-400">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {attentionProducts.map(
                      (product) => {

                        const quantity =
                          Number(
                            product.quantity ||
                              0
                          );

                        const status =
                          getStockStatus(
                            quantity
                          );

                        return (
                          <tr
                            key={
                              product._id
                            }
                            className="border-b border-slate-100 last:border-0"
                          >

                            <td className="px-5 py-4">

                              <p className="text-sm font-semibold text-slate-800">
                                {
                                  product.name
                                }
                              </p>

                            </td>

                            <td className="px-5 py-4 text-sm text-slate-500">
                              {product.category ||
                                "Uncategorized"}
                            </td>

                            <td className="px-5 py-4 text-right">

                              <span className="font-bold text-slate-800">
                                {
                                  quantity
                                }
                              </span>

                            </td>

                            <td className="px-5 py-4">

                              <span
                                className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-[11px] font-bold ${status.className}`}
                              >

                                {quantity ===
                                0 ? (
                                  <FaTimesCircle />
                                ) : (
                                  <FaExclamationTriangle />
                                )}

                                {
                                  status.label
                                }

                              </span>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>

          {/* ACTIVITY */}

          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden min-w-0">

            <div className="p-5 sm:p-6 border-b border-slate-200">

              <div className="flex items-center gap-2">

                <FaHistory className="text-slate-400" />

                <h2 className="font-bold text-slate-900">
                  System Activity
                </h2>

              </div>

              <p className="text-xs text-slate-400 mt-1">
                Current system events
              </p>

            </div>

            <div className="p-5 sm:p-6">

              <div className="space-y-5">

                {activity.map(
                  (item, index) => {

                    const Icon =
                      item.icon;

                    return (
                      <div
                        key={`${item.title}-${index}`}
                        className="flex gap-3"
                      >

                        <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">

                          <Icon className="text-xs" />

                        </div>

                        <div className="min-w-0">

                          <p className="text-xs font-semibold text-slate-700">
                            {item.title}
                          </p>

                          <p className="text-[11px] text-slate-400 mt-1">
                            {item.time}
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

          </section>

        </div>

        {/* =================================================
            OPERATIONS
        ================================================= */}

        <section className="w-full min-w-0">

          <div className="mb-4">

            <h2 className="text-lg font-bold text-slate-900">
              Operations
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Frequently used administrator controls
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

            <button
              type="button"
              className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-blue-300 hover:shadow-sm transition"
            >

              <FaUsers className="text-blue-600 mb-4" />

              <h3 className="font-semibold text-slate-800">
                User Management
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Manage accounts and permissions.
              </p>

            </button>

            <button
              type="button"
              className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-emerald-300 hover:shadow-sm transition"
            >

              <FaBoxes className="text-emerald-600 mb-4" />

              <h3 className="font-semibold text-slate-800">
                Inventory Control
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Review products and stock levels.
              </p>

            </button>

            <button
              type="button"
              className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-amber-300 hover:shadow-sm transition"
            >

              <FaExclamationTriangle className="text-amber-600 mb-4" />

              <h3 className="font-semibold text-slate-800">
                Stock Intelligence
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Review low and critical inventory.
              </p>

            </button>

            <button
              type="button"
              className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-violet-300 hover:shadow-sm transition"
            >

              <FaChartLine className="text-violet-600 mb-4" />

              <h3 className="font-semibold text-slate-800">
                Analytics
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Analyze inventory performance.
              </p>

            </button>

          </div>

        </section>

        {/* =================================================
            FOOTER STATUS
        ================================================= */}

        <div className="mt-7 bg-white border border-slate-200 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div className="flex items-center gap-3">

            <div className="w-8 h-8 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">

              <FaShieldAlt className="text-sm" />

            </div>

            <div>

              <p className="text-sm font-semibold text-slate-800">
                Platform Health
              </p>

              <p className="text-xs text-slate-400">
                Administrator services are operational
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">

            <span className="w-2 h-2 rounded-full bg-emerald-500" />

            Operational

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;