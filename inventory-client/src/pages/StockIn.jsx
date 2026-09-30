import { useCallback, useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowDown,
  FaSave,
} from "react-icons/fa";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../services/api";
import Loader from "../components/Loader";
import { useRegisterRefresh } from "../hooks/useRegisterRefresh";

function StockIn() {
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
  // STOCK IN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const qty = Number(quantity);

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

    try {
      setSaving(true);

      // -----------------------------------------
      // API
      // -----------------------------------------

      await api.post("/stock/in", {
        productId: id,
        quantity: qty,
        note: note.trim(),
      });

      // -----------------------------------------
      // SUCCESS
      // -----------------------------------------

      alert(
        `Stock In successful: ${qty} units added.`
      );

      setQuantity("");
      setNote("");

      navigate("/products");
    } catch (error) {
      console.error(
        "STOCK IN ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to add stock."
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
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center"
        >
          <FaArrowLeft />
        </button>

        <div>

          <p className="text-sm font-semibold text-green-600">
            Inventory Management
          </p>

          <h1 className="text-3xl font-bold text-slate-800 mt-1">
            Stock In
          </h1>

          <p className="text-slate-500 mt-1">
            Add stock to your inventory.
          </p>

        </div>

      </div>

      <div className="max-w-3xl">

        {/* PRODUCT SUMMARY */}

        {product && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <FaArrowDown />
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
                  Current Stock
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
              Add Stock
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Enter the quantity you want to add.
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
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              placeholder="Enter quantity"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50"
            />

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
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none resize-none focus:border-green-500 focus:ring-4 focus:ring-green-50"
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
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-60"
            >

              <FaSave />

              {saving
                ? "Adding..."
                : "Add Stock"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default StockIn;