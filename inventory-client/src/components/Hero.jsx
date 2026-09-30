import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaPlayCircle,
  FaChartLine,
  FaBoxes,
  FaBell,
} from "react-icons/fa";

function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white py-24">

      <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-12 items-center">

        {/* Left */}

        <div>

          <span className="bg-white/20 px-4 py-2 rounded-full">
            🚀 Smart Inventory Platform
          </span>

          <h1 className="text-6xl font-bold mt-8 leading-tight">
            Inventory Management
            <br />
            Made Simple
          </h1>

          <p className="mt-6 text-lg text-gray-200">
            Track products, monitor stock levels,
            generate reports and manage inventory
            from one powerful dashboard.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">

            <Link
              to="/register"
              className="bg-yellow-400 text-black px-7 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-yellow-300"
            >
              Get Started
              <FaArrowRight />
            </Link>

            <button
              className="border border-white px-7 py-3 rounded-xl flex items-center gap-2 hover:bg-white hover:text-blue-700"
            >
              <FaPlayCircle />
              Live Demo
            </button>

          </div>

          <div className="flex gap-8 mt-10">

            <div className="flex items-center gap-2">
              <FaBoxes />
              Product Tracking
            </div>

            <div className="flex items-center gap-2">
              <FaBell />
              Low Stock Alerts
            </div>

            <div className="flex items-center gap-2">
              <FaChartLine />
              Analytics
            </div>

          </div>

        </div>

        {/* Right */}

        <div className="flex justify-center">

          <div className="bg-white text-black rounded-3xl p-8 w-96 shadow-2xl">

            <h2 className="text-2xl font-bold mb-6">
              📊 Dashboard
            </h2>

            <div className="space-y-4">

              <div className="bg-blue-100 p-4 rounded-xl">
                📦 Products : 250
              </div>

              <div className="bg-green-100 p-4 rounded-xl">
                💰 Revenue : ₹5,20,000
              </div>

              <div className="bg-red-100 p-4 rounded-xl">
                ⚠ Low Stock : 12
              </div>

              <div className="bg-yellow-100 p-4 rounded-xl">
                📈 Growth : +28%
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;