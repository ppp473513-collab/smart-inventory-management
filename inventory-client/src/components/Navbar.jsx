import { Link } from "react-router-dom";
import { FaBoxes, FaSignInAlt, FaRocket } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-blue-600"
        >
          <FaBoxes className="text-3xl" />
          Smart Inventory
        </Link>

        {/* Menu */}
        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <a href="#home" className="hover:text-blue-600">Home</a>
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#about" className="hover:text-blue-600">About</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">

          <Link
            to="/login"
            className="flex items-center gap-2 border border-blue-600 text-blue-600 px-5 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            <FaSignInAlt />
            Login
          </Link>

          <Link
            to="/register"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaRocket />
            Get Started
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;