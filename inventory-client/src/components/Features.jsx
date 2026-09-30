import {
  FaBoxes,
  FaChartBar,
  FaBell,
  FaSearch,
  FaFileAlt,
  FaShieldAlt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaBoxes className="text-4xl text-blue-600" />,
    title: "Product Management",
    desc: "Add, update and manage inventory easily.",
  },
  {
    icon: <FaChartBar className="text-4xl text-green-600" />,
    title: "Analytics",
    desc: "View inventory insights and trends.",
  },
  {
    icon: <FaBell className="text-4xl text-red-500" />,
    title: "Stock Alerts",
    desc: "Receive low stock notifications.",
  },
  {
    icon: <FaSearch className="text-4xl text-yellow-500" />,
    title: "Quick Search",
    desc: "Search products instantly.",
  },
  {
    icon: <FaFileAlt className="text-4xl text-purple-600" />,
    title: "Reports",
    desc: "Generate inventory reports quickly.",
  },
  {
    icon: <FaShieldAlt className="text-4xl text-indigo-600" />,
    title: "Secure Access",
    desc: "Protected login and user management.",
  },
];

function Features() {
  return (
    <section id="features" className="py-20 bg-gray-100">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-3">
          Powerful Features
        </h2>

        <p className="text-center text-gray-600 mb-12">
          Everything you need to manage your inventory efficiently.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition duration-300"
            >
              {feature.icon}

              <h3 className="text-2xl font-semibold mt-5">
                {feature.title}
              </h3>

              <p className="text-gray-600 mt-3">
                {feature.desc}
              </p>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default Features;