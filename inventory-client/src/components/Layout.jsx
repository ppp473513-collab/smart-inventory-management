import { Outlet, useNavigate } from "react-router-dom";

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken");

    navigate("/login", { replace: true });
  };

  return (
    <div className="user-theme min-h-screen bg-slate-50">

      {/* USER SIDEBAR */}
      <aside className="fixed left-0 top-0 z-40 hidden lg:flex h-screen w-64 flex-col bg-slate-950 border-r border-slate-800">

        <div className="px-6 py-6">
          <h1 className="text-xl font-bold text-white">
            Smart Inventory
          </h1>

          <p className="text-xs text-teal-400 mt-1">
            Inventory Management
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <a
            href="/dashboard"
            className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-teal-600 hover:text-white transition"
          >
            Dashboard
          </a>

          <a
            href="/products"
            className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-teal-600 hover:text-white transition"
          >
            Products
          </a>

          <a
            href="/transactions"
            className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-teal-600 hover:text-white transition"
          >
            Transactions
          </a>

          <a
            href="/stock-alerts"
            className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-teal-600 hover:text-white transition"
          >
            Stock Alerts
          </a>

          <a
            href="/alerts"
            className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-teal-600 hover:text-white transition"
          >
            Alerts
          </a>

          <a
            href="/profile"
            className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-teal-600 hover:text-white transition"
          >
            Profile
          </a>
        </nav>

        <div className="p-4 border-t border-slate-800">

          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition"
          >
            Logout
          </button>

        </div>

      </aside>

      {/* USER CONTENT */}

      <main className="min-h-screen ml-0 lg:ml-64">
        <Outlet />
      </main>

    </div>
  );
}

export default Layout;