import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowDown,
  FaArrowUp,
  FaSearch,
  FaBoxOpen,
} from "react-icons/fa";

import api from "../services/api";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ==============================
  // FETCH PRODUCTS
  // ==============================
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.products || [];

      setProducts(data);
    } catch (error) {
      console.error(
        "FETCH PRODUCTS ERROR:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==============================
  // DELETE PRODUCT
  // ==============================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);

      setProducts((prev) =>
        prev.filter((product) => product._id !== id)
      );

      alert("Product deleted successfully");
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  // ==============================
  // SEARCH
  // ==============================
  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase().trim();

    return (
      product.name?.toLowerCase().includes(searchText) ||
      product.category?.toLowerCase().includes(searchText)
    );
  });

  // ==============================
  // STOCK STATUS
  // ==============================
  const getStockStatus = (quantity) => {
    const stock = Number(quantity || 0);

    if (stock === 0) {
      return {
        text: "Out of Stock",
        className:
          "bg-red-100 text-red-700",
      };
    }

    if (stock <= 10) {
      return {
        text: "Low Stock",
        className:
          "bg-yellow-100 text-yellow-700",
      };
    }

    return {
      text: "In Stock",
      className:
        "bg-green-100 text-green-700",
    };
  };

  // ==============================
  // LOADING
  // ==============================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500 font-semibold">
          Loading products...
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 lg:p-8">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Products
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage your inventory products
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/products/add")}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm transition"
        >
          <FaPlus />
          Add Product
        </button>

      </div>

      {/* ========================= */}
      {/* SEARCH */}
      {/* ========================= */}

      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">

        <div className="relative max-w-md">

          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

        </div>

      </div>

      {/* ========================= */}
      {/* EMPTY */}
      {/* ========================= */}

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">

          <FaBoxOpen className="mx-auto text-5xl text-slate-300 mb-4" />

          <h2 className="text-lg font-bold text-slate-700">
            No products found
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Add a product or change your search.
          </p>

        </div>
      ) : (

        /* ========================= */
        /* DESKTOP TABLE */
        /* ========================= */

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr>

                  <th className="text-left px-6 py-4 text-xs font-bold uppercase text-slate-500">
                    Product
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-bold uppercase text-slate-500">
                    Category
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-bold uppercase text-slate-500">
                    Price
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-bold uppercase text-slate-500">
                    Quantity
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-bold uppercase text-slate-500">
                    Status
                  </th>

                  <th className="text-center px-6 py-4 text-xs font-bold uppercase text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredProducts.map((product) => {

                  const quantity = Number(
                    product.quantity || 0
                  );

                  const status =
                    getStockStatus(quantity);

                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-slate-50 transition"
                    >

                      {/* PRODUCT */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FaBoxOpen />
                          </div>

                          <div>

                            <p className="font-semibold text-slate-800">
                              {product.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              ID: {product._id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* CATEGORY */}

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {product.category || "-"}
                      </td>

                      {/* PRICE */}

                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                        ₹{Number(product.price || 0).toFixed(2)}
                      </td>

                      {/* QUANTITY */}

                      <td className="px-6 py-4">

                        <span className="font-bold text-slate-800">
                          {quantity}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${status.className}`}
                        >
                          {status.text}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-4">

                        <div className="flex items-center justify-center gap-2">

                          {/* EDIT */}

                          <button
                            type="button"
                            title="Edit Product"
                            onClick={() =>
                              navigate(
                                `/products/edit/${product._id}`
                              )
                            }
                            className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition"
                          >
                            <FaEdit />
                          </button>

                          {/* STOCK IN */}

                          <button
                            type="button"
                            title="Stock In"
                            onClick={() =>
                              navigate(
                                `/stock-in/${product._id}`
                              )
                            }
                            className="w-9 h-9 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition"
                          >
                            <FaArrowDown />
                          </button>

                          {/* STOCK OUT */}

                          <button
                            type="button"
                            title="Stock Out"
                            onClick={() =>
                              navigate(
                                `/stock-out/${product._id}`
                              )
                            }
                            className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 flex items-center justify-center transition"
                          >
                            <FaArrowUp />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            title="Delete Product"
                            onClick={() =>
                              handleDelete(
                                product._id
                              )
                            }
                            className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition"
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
}

export default Products;