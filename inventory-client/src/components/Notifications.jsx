import { useEffect, useState } from "react";
import { FaBell, FaExclamationTriangle } from "react-icons/fa";
import api from "../services/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/products");

        const lowStockProducts = response.data.filter(
          (product) => product.quantity <= 10
        );

        setNotifications(lowStockProducts);
      } catch (error) {
        console.error("Notification error:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="relative">

      {/* Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-gray-500 hover:text-blue-600"
      >
        <FaBell className="text-xl" />

        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification panel */}
      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-2xl border z-50">

          <div className="p-4 border-b">
            <h3 className="font-bold text-gray-800">
              Notifications
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Inventory alerts
            </p>
          </div>

          {notifications.length === 0 ? (
            <div className="p-6 text-center text-green-600">
              ✓ No stock alerts
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">

              {notifications.map((product) => (
                <div
                  key={product._id}
                  className="p-4 border-b hover:bg-gray-50"
                >

                  <div className="flex gap-3">

                    <div className="w-9 h-9 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                      <FaExclamationTriangle />
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">
                        {product.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {product.quantity === 0
                          ? "Out of stock"
                          : `Only ${product.quantity} left`}
                      </p>
                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default Notifications;