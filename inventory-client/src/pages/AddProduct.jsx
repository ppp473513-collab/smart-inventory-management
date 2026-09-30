import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import api from "../services/api";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(false);

  // ==============================
  // INPUT CHANGE
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // SUBMIT
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const category = formData.category.trim();
    const price = formData.price;
    const quantity = formData.quantity;

    // ==============================
    // VALIDATION
    // ==============================

    if (!name) {
      alert("Product name is required");
      return;
    }

    if (!category) {
      alert("Category is required");
      return;
    }

    if (price === "" || Number(price) <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    if (!Number.isFinite(Number(price))) {
      alert("Enter a valid price");
      return;
    }

    if (quantity === "" || Number(quantity) < 0) {
      alert("Quantity cannot be negative");
      return;
    }

    if (!Number.isInteger(Number(quantity))) {
      alert("Quantity must be a whole number");
      return;
    }

    if (!Number.isFinite(Number(quantity))) {
      alert("Enter a valid quantity");
      return;
    }

    // ==============================
    // API REQUEST
    // ==============================

    try {
      setLoading(true);

      await api.post("/products", {
        name,
        category,
        price: Number(price),
        quantity: Number(quantity),
      });

      alert("Product added successfully");

      navigate("/products");
    } catch (error) {
      console.error(
        "ADD PRODUCT ERROR:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 lg:p-8">

      {/* ============================== */}
      {/* HEADER */}
      {/* ============================== */}

      <div className="flex items-center gap-4 mb-6">

        <button
          type="button"
          onClick={() => navigate("/products")}
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center transition"
        >
          <FaArrowLeft />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Add Product
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Add a new product to your inventory
          </p>
        </div>

      </div>

      {/* ============================== */}
      {/* FORM */}
      {/* ============================== */}

      <div className="max-w-3xl">

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
        >

          {/* PRODUCT NAME */}

          <div className="mb-5">

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          </div>

          {/* CATEGORY */}

          <div className="mb-5">

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          </div>

          {/* PRICE + QUANTITY */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* PRICE */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Price
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  ₹
                </span>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

              </div>

            </div>

            {/* QUANTITY */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="1"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

            </div>

          </div>

          {/* ============================== */}
          {/* BUTTONS */}
          {/* ============================== */}

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave />

              {loading
                ? "Adding..."
                : "Add Product"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddProduct;