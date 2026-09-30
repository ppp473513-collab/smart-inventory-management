import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function CTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white">

      <div className="max-w-6xl mx-auto text-center px-6">

        <h2 className="text-5xl font-bold">
          Ready to Transform Your Inventory?
        </h2>

        <p className="text-xl mt-6 text-gray-200">
          Organize products, track stock, and grow your business with one smart platform.
        </p>

        <div className="mt-10">

          <Link
            to="/register"
            className="inline-flex items-center gap-3 bg-yellow-400 text-black px-8 py-4 rounded-xl text-lg font-bold hover:bg-yellow-300 transition"
          >
            Get Started
            <FaArrowRight />
          </Link>

        </div>

      </div>

    </section>
  );
}

export default CTA;