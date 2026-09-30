import {
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        <div>
          <h2 className="text-3xl font-bold text-blue-400">
            📦 Smart Inventory
          </h2>

          <p className="mt-4 text-gray-400">
            Modern inventory management platform for businesses.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li>Home</li>
            <li>Features</li>
            <li>Login</li>
            <li>Register</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">
            Follow Us
          </h3>

          <div className="flex gap-5 text-2xl">

            <FaFacebook className="hover:text-blue-500 cursor-pointer" />

            <FaGithub className="hover:text-gray-300 cursor-pointer" />

            <FaLinkedin className="hover:text-blue-400 cursor-pointer" />

            <FaInstagram className="hover:text-pink-500 cursor-pointer" />

          </div>

        </div>

      </div>

      <hr className="my-8 border-gray-700" />

      <p className="text-center text-gray-500">
        © 2026 Smart Inventory Management. All Rights Reserved.
      </p>

    </footer>
  );
}

export default Footer;