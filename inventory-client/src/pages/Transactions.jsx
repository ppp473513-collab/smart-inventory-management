import { useCallback, useEffect, useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaSearch,
  FaSyncAlt,
  FaExchangeAlt,
} from "react-icons/fa";

import api from "../services/api";
import Loader from "../components/Loader";
import { useRegisterRefresh } from "../hooks/useRegisterRefresh";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const fetchTransactions = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await api.get("/stock/history");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.transactions || [];

      setTransactions(data);
    } catch (error) {
      console.error(
        "TRANSACTION ERROR:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useRegisterRefresh(
    () => fetchTransactions(false),
    [fetchTransactions]
  );

  const filteredTransactions = transactions.filter((transaction) => {
    const productName =
      transaction.product?.name?.toLowerCase() || "";

    const note =
      transaction.note?.toLowerCase() || "";

    const searchText = search.toLowerCase();

    const matchesSearch =
      productName.includes(searchText) ||
      note.includes(searchText);

    const matchesType =
      type === "All" ||
      transaction.type === type;

    return matchesSearch && matchesType;
  });

  const totalIn = transactions
    .filter((item) => item.type === "IN")
    .reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );

  const totalOut = transactions
    .filter((item) => item.type === "OUT")
    .reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="p-5 sm:p-6 lg:p-8">

          {/* HEADER */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

            <div>

              <p className="text-sm font-semibold text-purple-600">
                Inventory Management
              </p>

              <h1 className="text-3xl font-bold text-slate-800 mt-1">
                Transactions
              </h1>

              <p className="text-slate-500 mt-2">
                View all stock movement history.
              </p>

            </div>

            <button
              type="button"
              onClick={() => fetchTransactions(false)}
              disabled={refreshing}
              className="w-fit flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm disabled:opacity-60"
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
              <Loader text="Loading transactions..." />
            </div>

          ) : (

            <>

              {/* SUMMARY */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                  <p className="text-sm text-slate-500">
                    Total Transactions
                  </p>

                  <p className="text-3xl font-bold text-slate-800 mt-2">
                    {transactions.length}
                  </p>

                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                  <p className="text-sm text-slate-500">
                    Total Stock In
                  </p>

                  <p className="text-3xl font-bold text-green-600 mt-2">
                    +{totalIn}
                  </p>

                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                  <p className="text-sm text-slate-500">
                    Total Stock Out
                  </p>

                  <p className="text-3xl font-bold text-red-600 mt-2">
                    -{totalOut}
                  </p>

                </div>

              </div>

              {/* FILTERS */}

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="relative">

                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="Search product or note..."
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500"
                    />

                  </div>

                  <select
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value)
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500"
                  >
                    <option value="All">
                      All Transactions
                    </option>

                    <option value="IN">
                      Stock In
                    </option>

                    <option value="OUT">
                      Stock Out
                    </option>
                  </select>

                </div>

              </div>

              {/* TABLE */}

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                <div className="px-6 py-5 border-b border-slate-100">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <FaExchangeAlt />
                    </div>

                    <div>

                      <h2 className="text-lg font-bold text-slate-800">
                        Stock History
                      </h2>

                      <p className="text-sm text-slate-400">
                        {filteredTransactions.length} transactions
                      </p>

                    </div>

                  </div>

                </div>

                {filteredTransactions.length === 0 ? (

                  <div className="p-16 text-center">

                    <FaExchangeAlt className="mx-auto text-4xl text-slate-300 mb-4" />

                    <h3 className="font-bold text-slate-700">
                      No transactions found
                    </h3>

                    <p className="text-sm text-slate-400 mt-1">
                      Stock movements will appear here.
                    </p>

                  </div>

                ) : (

                  <div className="overflow-x-auto">

                    <table className="w-full">

                      <thead className="bg-slate-50 border-b border-slate-100">

                        <tr>

                          <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                            Product
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                            Type
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                            Quantity
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                            Note
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                            User
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                            Date
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {filteredTransactions.map(
                          (transaction) => {

                            const isIn =
                              transaction.type ===
                              "IN";

                            return (
                              <tr
                                key={
                                  transaction._id
                                }
                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                              >

                                {/* PRODUCT */}

                                <td className="px-6 py-5">

                                  <div className="flex items-center gap-3">

                                    <div
                                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                        isIn
                                          ? "bg-green-50 text-green-600"
                                          : "bg-red-50 text-red-600"
                                      }`}
                                    >
                                      {isIn ? (
                                        <FaArrowDown />
                                      ) : (
                                        <FaArrowUp />
                                      )}
                                    </div>

                                    <div>

                                      <p className="font-semibold text-slate-800">
                                        {transaction.product?.name ||
                                          "Unknown Product"}
                                      </p>

                                      <p className="text-xs text-slate-400">
                                        {transaction.product?.category ||
                                          "-"}
                                      </p>

                                    </div>

                                  </div>

                                </td>

                                {/* TYPE */}

                                <td className="px-6 py-5">

                                  <span
                                    className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${
                                      isIn
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {isIn
                                      ? "STOCK IN"
                                      : "STOCK OUT"}
                                  </span>

                                </td>

                                {/* QUANTITY */}

                                <td className="px-6 py-5">

                                  <span
                                    className={`font-bold ${
                                      isIn
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {isIn
                                      ? "+"
                                      : "-"}
                                    {transaction.quantity}
                                  </span>

                                </td>

                                {/* NOTE */}

                                <td className="px-6 py-5">

                                  <span className="text-sm text-slate-600">
                                    {transaction.note ||
                                      "-"}
                                  </span>

                                </td>

                                {/* USER */}

                                <td className="px-6 py-5">

                                  <div>

                                    <p className="text-sm font-medium text-slate-700">
                                      {transaction.user?.name ||
                                        "User"}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                      {transaction.user?.email ||
                                        ""}
                                    </p>

                                  </div>

                                </td>

                                {/* DATE */}

                                <td className="px-6 py-5 whitespace-nowrap">

                                  <span className="text-sm text-slate-500">
                                    {formatDate(
                                      transaction.createdAt
                                    )}
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

              </div>

            </>

          )}

    </div>
  );
}

export default Transactions;