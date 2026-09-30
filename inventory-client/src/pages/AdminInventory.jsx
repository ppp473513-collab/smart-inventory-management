import { useEffect, useMemo, useState } from "react";

import {
  FaBoxes,
  FaSearch,
  FaSyncAlt,
  FaExclamationTriangle,
  FaTimesCircle,
  FaCheckCircle,
  FaRupeeSign,
  FaTrash,
  FaFilter,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";

import api from "../services/api";

function AdminInventory() {
  // =====================================================
  // STATE
  // =====================================================

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [processingId, setProcessingId] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  const loadProducts = async () => {
    try {
      setError("");
      setRefreshing(true);

      const response =
        await api.get("/products");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.products || [];

      setProducts(data);
    } catch (error) {
      console.error(
        "ADMIN INVENTORY ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to load inventory."
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
    loadProducts();
  }, []);

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = useMemo(() => {
    const values = products
      .map((product) =>
        product.category?.trim()
      )
      .filter(Boolean);

    return [...new Set(values)].sort();
  }, [products]);

  // =====================================================
  // STATUS
  // =====================================================

  const getStatus = (quantity) => {
    const qty = Number(quantity || 0);

    if (qty === 0) {
      return {
        value: "out",
        label: "Out of Stock",
        className:
          "bg-red-50 text-red-700 border-red-200",
        icon: FaTimesCircle,
      };
    }

    if (qty <= 10) {
      return {
        value: "low",
        label: "Low Stock",
        className:
          "bg-amber-50 text-amber-700 border-amber-200",
        icon: FaExclamationTriangle,
      };
    }

    return {
      value: "healthy",
      label: "Healthy",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: FaCheckCircle,
    };
  };

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {
    const text =
      search.trim().toLowerCase();

    return products.filter((product) => {
      const name =
        product.name?.toLowerCase() || "";

      const category =
        product.category?.toLowerCase() || "";

      const matchesSearch =
        !text ||
        name.includes(text) ||
        category.includes(text);

      const matchesCategory =
        categoryFilter === "all" ||
        product.category === categoryFilter;

      const status = getStatus(
        product.quantity
      );

      const matchesStatus =
        statusFilter === "all" ||
        status.value === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    products,
    search,
    categoryFilter,
    statusFilter,
  ]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalProducts =
    products.length;

  const totalUnits =
    products.reduce(
      (sum, product) =>
        sum +
        Number(product.quantity || 0),
      0
    );

  const totalValue =
    products.reduce(
      (sum, product) =>
        sum +
        Number(product.quantity || 0) *
          Number(product.price || 0),
      0
    );

  const lowStock =
    products.filter((product) => {
      const qty =
        Number(product.quantity || 0);

      return qty > 0 && qty <= 10;
    }).length;

  const outOfStock =
    products.filter(
      (product) =>
        Number(product.quantity || 0) === 0
    ).length;

  // =====================================================
  // STOCK IN
  // =====================================================

  const handleStockIn = async (product) => {
    const input = window.prompt(
      `Enter Stock In quantity for "${product.name}":`
    );

    if (input === null) {
      return;
    }

    const quantity = Number(input);

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      alert(
        "Please enter a valid whole number greater than 0."
      );
      return;
    }

    try {
      setError("");
      setProcessingId(product._id);

      await api.post("/stock/in", {
        productId: product._id,
        quantity,
        note: "Stock added by admin",
      });

      alert(
        `${quantity} units added successfully.`
      );

      await loadProducts();
    } catch (error) {
      console.error(
        "ADMIN STOCK IN ERROR:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to add stock."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // STOCK OUT
  // =====================================================

  const handleStockOut = async (product) => {
    const available =
      Number(product.quantity || 0);

    if (available <= 0) {
      alert(
        `"${product.name}" has no available stock.`
      );
      return;
    }

    const input = window.prompt(
      `Enter Stock Out quantity for "${product.name}":\n\nAvailable stock: ${available}`
    );

    if (input === null) {
      return;
    }

    const quantity = Number(input);

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      alert(
        "Please enter a valid whole number greater than 0."
      );
      return;
    }

    if (quantity > available) {
      alert(
        `Only ${available} units are available.`
      );
      return;
    }

    try {
      setError("");
      setProcessingId(product._id);

      await api.post("/stock/out", {
        productId: product._id,
        quantity,
        note: "Stock removed by admin",
      });

      alert(
        `${quantity} units removed successfully.`
      );

      await loadProducts();
    } catch (error) {
      console.error(
        "ADMIN STOCK OUT ERROR:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to remove stock."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(product._id);
      setError("");

      await api.delete(
        `/products/${product._id}`
      );

      setProducts((current) =>
        current.filter(
          (item) =>
            item._id !== product._id
        )
      );

      alert("Product deleted successfully.");
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen w-full bg-white">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="bg-white border-b border-slate-200">

        <div className="w-full px-5 sm:px-6 lg:px-8 py-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4 min-w-0">

              <div className="w-12 h-12 shrink-0 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">

                <FaBoxes className="text-lg" />

              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
                  Administration
                </p>

                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mt-1">
                  Inventory Control
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Manage and monitor the complete inventory.
                </p>

              </div>

            </div>

            {/* REFRESH */}

            <button
              type="button"
              onClick={loadProducts}
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
          MAIN
      ================================================= */}

      <main className="w-full px-5 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">

          {/* TOTAL PRODUCTS */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Total Products
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              {loading
                ? "..."
                : totalProducts}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              Registered inventory items
            </p>

          </div>

          {/* TOTAL UNITS */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Available Units
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              {loading
                ? "..."
                : totalUnits.toLocaleString(
                    "en-IN"
                  )}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              Current physical stock
            </p>

          </div>

          {/* VALUE */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Inventory Value
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2 flex items-center gap-1">

              <FaRupeeSign className="text-sm" />

              {loading
                ? "..."
                : totalValue.toLocaleString(
                    "en-IN"
                  )}

            </p>

            <p className="text-xs text-slate-400 mt-2">
              Current estimated value
            </p>

          </div>

          {/* ALERTS */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Stock Alerts
            </p>

            <div className="flex gap-8 mt-3">

              <div>

                <p className="text-xl font-bold text-amber-600">
                  {lowStock}
                </p>

                <p className="text-xs text-slate-400">
                  Low stock
                </p>

              </div>

              <div>

                <p className="text-xl font-bold text-red-600">
                  {outOfStock}
                </p>

                <p className="text-xs text-slate-400">
                  Out of stock
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

            {/* SEARCH */}

            <div className="relative">

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

            {/* CATEGORY */}

            <div className="relative">

              <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value
                  )
                }
                className="w-full appearance-none pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm bg-white text-slate-900 outline-none focus:border-amber-500"
              >

                <option value="all">
                  All Categories
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white text-slate-900 outline-none focus:border-amber-500"
            >

              <option value="all">
                All Stock Status
              </option>

              <option value="healthy">
                Healthy
              </option>

              <option value="low">
                Low Stock
              </option>

              <option value="out">
                Out of Stock
              </option>

            </select>

          </div>

        </div>

        {/* =================================================
            INVENTORY TABLE
        ================================================= */}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

          {/* TABLE HEADER */}

          <div className="px-5 sm:px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Inventory
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                {filteredProducts.length} of{" "}
                {products.length} products displayed
              </p>

            </div>

            <div className="text-xs font-semibold text-amber-600">
              Admin controls enabled
            </div>

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="p-16 text-center">

              <FaSyncAlt className="mx-auto text-2xl text-slate-300 animate-spin" />

              <p className="text-sm text-slate-500 mt-4">
                Loading inventory...
              </p>

            </div>

          ) : filteredProducts.length === 0 ? (

            /* EMPTY */

            <div className="p-16 text-center">

              <FaBoxes className="mx-auto text-4xl text-slate-300" />

              <p className="font-semibold text-slate-600 mt-4">
                No products found
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Try changing your search or filters.
              </p>

            </div>

          ) : (

            /* TABLE */

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr>

                    <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Product
                    </th>

                    <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Category
                    </th>

                    <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Price
                    </th>

                    <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Quantity
                    </th>

                    <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Value
                    </th>

                    <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredProducts.map(
                    (product) => {

                      const quantity =
                        Number(
                          product.quantity || 0
                        );

                      const price =
                        Number(
                          product.price || 0
                        );

                      const value =
                        quantity * price;

                      const status =
                        getStatus(quantity);

                      const StatusIcon =
                        status.icon;

                      const isProcessing =
                        processingId ===
                        product._id;

                      const isDeleting =
                        deletingId ===
                        product._id;

                      return (
                        <tr
                          key={product._id}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition"
                        >

                          {/* PRODUCT */}

                          <td className="px-6 py-5">

                            <p className="font-semibold text-sm text-slate-800">
                              {product.name}
                            </p>

                            <p className="text-[11px] text-slate-400 mt-1">
                              ID:{" "}
                              {product._id?.slice(
                                -8
                              )}
                            </p>

                          </td>

                          {/* CATEGORY */}

                          <td className="px-6 py-5 text-sm text-slate-600">
                            {product.category ||
                              "Uncategorized"}
                          </td>

                          {/* PRICE */}

                          <td className="px-6 py-5 text-right text-sm font-medium text-slate-700">

                            ₹
                            {price.toLocaleString(
                              "en-IN"
                            )}

                          </td>

                          {/* QUANTITY */}

                          <td className="px-6 py-5 text-right">

                            <span className="text-sm font-bold text-slate-800">
                              {quantity}
                            </span>

                          </td>

                          {/* VALUE */}

                          <td className="px-6 py-5 text-right text-sm font-semibold text-slate-700">

                            ₹
                            {value.toLocaleString(
                              "en-IN"
                            )}

                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold ${status.className}`}
                            >

                              <StatusIcon />

                              {status.label}

                            </span>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-6 py-5">

                            <div className="flex items-center justify-end gap-2">

                              {/* STOCK IN */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleStockIn(
                                    product
                                  )
                                }
                                disabled={
                                  isProcessing ||
                                  isDeleting
                                }
                                title="Add stock"
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition text-xs font-semibold disabled:opacity-40"
                              >

                                {isProcessing ? (
                                  <FaSyncAlt className="animate-spin" />
                                ) : (
                                  <FaArrowDown />
                                )}

                                In

                              </button>

                              {/* STOCK OUT */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleStockOut(
                                    product
                                  )
                                }
                                disabled={
                                  isProcessing ||
                                  isDeleting ||
                                  quantity === 0
                                }
                                title="Remove stock"
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 transition text-xs font-semibold disabled:opacity-40"
                              >

                                <FaArrowUp />

                                Out

                              </button>

                              {/* DELETE */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    product
                                  )
                                }
                                disabled={
                                  isProcessing ||
                                  isDeleting
                                }
                                title="Delete product"
                                className="w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition flex items-center justify-center disabled:opacity-40"
                              >

                                {isDeleting ? (
                                  <FaSyncAlt className="animate-spin" />
                                ) : (
                                  <FaTrash />
                                )}

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

      </main>

    </div>
  );
}

export default AdminInventory;