import { useCallback, useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowUp,
  FaSave,
} from "react-icons/fa";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../services/api";
import Loader from "../components/Loader";
import { useRegisterRefresh } from "../hooks/useRegisterRefresh";

function StockOut() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PRODUCT
  // =====================================================

  const fetchProduct = useCallback(
    async (showLoader = true) => {
      if (!id || id === "undefined") {
        setError("No product selected.");
        setLoading(false);

        navigate("/products", {
          replace: true,
        });

        return;
      }

      try {
        if (showLoader) {
          setLoading(true);
        }

        setError("");

        const response = await api.get(
          `/products/${id}`
        );

        const productData =
          response.data?.product ||
          response.data;

        setProduct(productData);
      } catch (error) {
        console.error(
          "LOAD PRODUCT ERROR:",
          error.response?.data ||
            error.message
        );

        setError(
          error.response?.data?.message ||
            "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    },
    [id, navigate]
  );

  // =====================================================
  // LOAD ON OPEN
  // =====================================================

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // =====================================================
  // REFRESH
  // =====================================================

  useRegisterRefresh(
    () => fetchProduct(false),
    [fetchProduct]
  );

  // =====================================================
  // STOCK OUT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const qty = Number(quantity);

    const available = Number(
      product?.quantity || 0
    );

    // -----------------------------------------
    // VALIDATION
    // -----------------------------------------

    if (
      quantity === "" ||
      !Number.isFinite(qty) ||
      qty <= 0
    ) {
      setError(
        "Quantity must be greater than 0."
      );
      return;
    }

    if (!Number.isInteger(qty)) {
      setError(
        "Quantity must be a whole number."
      );
      return;
    }

    if (qty > available) {
      setError(
        `Only ${available} units are available.`
      );
      return;
    }

    try {
      setSaving(true);

      // -----------------------------------------
      // API
      // -----------------------------------------

      await api.post("/stock/out", {
        productId: id,
        quantity: qty,
        note: note.trim(),
      });

      // -----------------------------------------
      // SUCCESS
      // -----------------------------------------

      alert(
        `Stock Out successful: ${qty} units removed.`
      );

      setQuantity("");
      setNote("");

      navigate("/products");
    } catch (error) {
      console.error(
        "STOCK OUT ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to remove stock."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="p-5 sm:p-6 lg:p-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12">
          <Loader text="Loading product..." />
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="p-5 sm:p-6 lg:p-8">

      {/* HEADER */}

      <div className="flex items-center gap-4 mb-8">

        <button
          type="button"
          onClick={() =>
            navigate("/products")
          }
          disabled={saving}
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center disabled:opacity-60"
        >
          <FaArrowLeft />
        </button>

        <div>

          <p className="text-sm font-semibold text-orange-600">
            Inventory Management
          </p>

          <h1 className="text-3xl font-bold text-slate-800 mt-1">
            Stock Out
          </h1>

          <p className="text-slate-500 mt-1">
            Remove stock from your inventory.
          </p>

        </div>

      </div>

      <div className="max-w-3xl">

        {/* PRODUCT SUMMARY */}

        {product && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <FaArrowUp />
              </div>

              <div>

                <h2 className="text-lg font-bold text-slate-800">
                  {product.name}
                </h2>

                <p className="text-sm text-slate-400">
                  {product.category ||
                    "No category"}
                </p>

              </div>

              <div className="ml-auto text-right">

                <p className="text-xs text-slate-400">
                  Available Stock
                </p>

                <p className="text-2xl font-bold text-slate-800">
                  {Number(
                    product.quantity || 0
                  )}
                </p>

              </div>

            </div>

          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8"
        >

          {/* ERROR */}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="mb-6">

            <h2 className="text-lg font-bold text-slate-800">
              Remove Stock
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Enter the quantity you want to remove.
            </p>

          </div>

          {/* QUANTITY */}

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Quantity
              <span className="text-red-500 ml-1">
                *
              </span>
            </label>

            <input
              type="number"
              min="1"
              step="1"
              max={availableStock(product)}
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              placeholder="Enter quantity"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50"
            />

            <p className="text-xs text-slate-400 mt-2">
              Maximum available:{" "}
              {Number(
                product?.quantity || 0
              )}{" "}
              units
            </p>

          </div>

          {/* NOTE */}

          <div className="mt-5">

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Note
            </label>

            <textarea
              rows="4"
              value={note}
              onChange={(e) =>
                setNote(e.target.value)
              }
              placeholder="Optional note..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none resize-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50"
            />

          </div>

          {/* BUTTONS */}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-8 pt-6 border-t border-slate-100">

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              disabled={saving}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold disabled:opacity-60"
            >

              <FaSave />

              {saving
                ? "Removing..."
                : "Remove Stock"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

// =====================================================
// AVAILABLE STOCK HELPER
// =====================================================

function availableStock(product) {
  return Number(
    product?.quantity || 0
  );
}

export default StockOut;