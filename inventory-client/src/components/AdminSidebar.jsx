import {
  FaTachometerAlt,
  FaUsers,
  FaBoxes,
  FaExclamationTriangle,
  FaChartLine,
  FaExchangeAlt,
  FaHistory,
  FaCog,
  FaUserCircle,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";

function AdminSidebar({
  activeSection,
  setActiveSection,
}) {
  const menuItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: FaTachometerAlt,
    },
    {
      id: "users",
      label: "Users",
      icon: FaUsers,
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: FaBoxes,
    },
    {
      id: "alerts",
      label: "Stock Intelligence",
      icon: FaExclamationTriangle,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: FaChartLine,
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: FaExchangeAlt,
    },
    {
      id: "audit",
      label: "Audit Log",
      icon: FaHistory,
    },
    {
      id: "settings",
      label: "Settings",
      icon: FaCog,
    },
  ];

  const accountItems = [
    {
      id: "profile",
      label: "Profile",
      icon: FaUserCircle,
    },
    {
      id: "change-password",
      label: "Change Password",
      icon: FaLock,
    },
  ];

  const handleClick = (id) => {
    setActiveSection(id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken");

    window.location.href = "/admin-login";
  };

  const MenuButton = ({ item }) => {
    const Icon = item.icon;
    const isActive =
      activeSection === item.id;

    return (
      <button
        type="button"
        onClick={() =>
          handleClick(item.id)
        }
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition ${
          isActive
            ? "bg-amber-500 text-white"
            : "text-slate-600 hover:bg-amber-50 hover:text-amber-700"
        }`}
      >
        <Icon
          className={
            isActive
              ? "text-white"
              : "text-slate-400"
          }
        />

        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-[9999]
        flex
        h-screen
        w-64
        xl:w-72
        flex-col
        bg-white
        border-r
        border-slate-200
        shadow-sm
      "
    >
      {/* BRAND */}

      <div className="px-6 py-6 border-b border-slate-200">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center">
            <FaBoxes />
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Smart Inventory
            </h1>

            <p className="text-xs font-semibold text-amber-600 mt-1">
              Admin Panel
            </p>
          </div>

        </div>

      </div>

      {/* NAVIGATION */}

      <div className="flex-1 overflow-y-auto px-4 py-5">

        <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Management
        </p>

        <div className="space-y-1.5">

          {menuItems.map((item) => (
            <MenuButton
              key={item.id}
              item={item}
            />
          ))}

        </div>

        {/* ACCOUNT */}

        <div className="mt-8">

          <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Account
          </p>

          <div className="space-y-1.5">

            {accountItems.map((item) => (
              <MenuButton
                key={item.id}
                item={item}
              />
            ))}

          </div>

        </div>

      </div>

      {/* LOGOUT */}

      <div className="p-4 border-t border-slate-200">

        <button
          type="button"
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-xl
            text-sm
            font-semibold
            text-slate-600
            hover:bg-red-50
            hover:text-red-600
            transition
          "
        >
          <FaSignOutAlt />

          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default AdminSidebar;