import {
  FaBoxes,
  FaExclamationTriangle,
  FaChartLine,
  FaRupeeSign,
} from "react-icons/fa";

function DashboardPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800">
            Powerful Dashboard
          </h2>

          <p className="text-gray-500 mt-4 text-lg">
            Monitor your inventory with real-time insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side */}
          <div>
            <h3 className="text-4xl font-bold text-blue-700">
              Everything in One Dashboard
            </h3>

            <p className="mt-6 text-gray-600 text-lg">
              Track products, monitor stock levels, generate reports,
              and analyze your business performance with ease.
            </p>

            <div className="space-y-4 mt-8">
              <p>✅ Product Tracking</p>
              <p>✅ Real-Time Analytics</p>
              <p>✅ Low Stock Alerts</p>
              <p>✅ Inventory Reports</p>
            </div>
          </div>

          {/* Right Side Dashboard */}
          <div className="bg-gray-100 rounded-3xl p-8 shadow-xl">

            <div className="grid grid-cols-2 gap-5">

              <div className="bg-white p-5 rounded-xl shadow">
                <FaBoxes className="text-blue-600 text-3xl mb-3" />
                <h2 className="text-3xl font-bold">250</h2>
                <p className="text-gray-500">Products</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <FaExclamationTriangle className="text-red-500 text-3xl mb-3" />
                <h2 className="text-3xl font-bold">12</h2>
                <p className="text-gray-500">Low Stock</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <FaRupeeSign className="text-green-600 text-3xl mb-3" />
                <h2 className="text-3xl font-bold">₹5L</h2>
                <p className="text-gray-500">Revenue</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <FaChartLine className="text-purple-600 text-3xl mb-3" />
                <h2 className="text-3xl font-bold">32%</h2>
                <p className="text-gray-500">Growth</p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default DashboardPreview;