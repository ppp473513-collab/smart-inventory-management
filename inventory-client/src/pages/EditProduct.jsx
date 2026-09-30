import { useCallback, useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaSave,
} from "react-icons/fa";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../services/api";
import Loader from "../components/Loader";
import { useRegisterRefresh } from "../hooks/useRegisterRefresh";

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchProduct = useCallback(async (showLoader = true) => {
    if (!id) return;

    try {
      if (showLoader) {
        setLoading(true);
      }

      const response = await api.get(
        `/products/${id}`
      );

      const product =
        response.data?.product ||
        response.data;

      setForm({
        name: product.name || "",
        category: product.category || "",
        quantity:
          product.quantity ?? "",
        price: product.price ?? "",
        description:
          product.description || "",
      });
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
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useRegisterRefresh(
    () => fetchProduct(false),
    [fetchProduct]
  );

  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =========================================
  // SAVE
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }

    if (form.quantity === "") {
      setError("Quantity is required.");
      return;
    }

    if (Number(form.quantity) < 0) {
      setError(
        "Quantity cannot be negative."
      );
      return;
    }

    if (form.price === "") {
      setError("Price is required.");
      return;
    }

    if (Number(form.price) < 0) {
      setError(
        "Price cannot be negative."
      );
      return;
    }

    try {
      setSaving(true);

      await api.put(`/products/${id}`, {
        name: form.name.trim(),
        category: form.category.trim(),
        quantity: Number(form.quantity),
        price: Number(form.price),
        description:
          form.description.trim(),
      });

      alert(
        "Product updated successfully."
      );

      navigate("/products");
    } catch (error) {
      console.error(
        "UPDATE PRODUCT ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="p-5 sm:p-6 lg:p-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12">
          <Loader text="Loading product..." />
        </div>
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

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

              <p className="text-sm font-semibold text-blue-600">
                Inventory Management
              </p>

              <h1 className="text-3xl font-bold text-slate-800 mt-1">
                Edit Product
              </h1>

              <p className="text-slate-500 mt-1">
                Update product information.
              </p>

            </div>

          </div>

          {/* FORM */}

          <div className="max-w-4xl">

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

              {/* PRODUCT INFORMATION */}

              <div className="mb-8">

                <h2 className="text-lg font-bold text-slate-800">
                  Product Information
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Update the details below.
                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* NAME */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Product Name
                    <span className="text-red-500 ml-1">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                {/* CATEGORY */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category
                    <span className="text-red-500 ml-1">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Enter category"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

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
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    For stock movement, use Stock In
                    or Stock Out.
                  </p>

                </div>

                {/* PRICE */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Price
                    <span className="text-red-500 ml-1">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />

                  </div>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="mt-5">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Enter description..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-8 pt-6 border-t border-slate-100">

                <button
                  type="button"
                  onClick={() =>
                    navigate("/products")
                  }
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-60"
                >
                  <FaSave />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

    </div>
  );
}

export default EditProduct;