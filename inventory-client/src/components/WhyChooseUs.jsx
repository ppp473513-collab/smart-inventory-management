 import {
  FaCheckCircle,
  FaShieldAlt,
  FaChartBar,
  FaClock,
  FaDatabase,
  FaUsers,
} from "react-icons/fa";

const benefits = [
  {
    icon: <FaCheckCircle className="text-green-500 text-3xl" />,
    title: "Easy Inventory",
    desc: "Manage products with ease.",
  },
  {
    icon: <FaShieldAlt className="text-blue-600 text-3xl" />,
    title: "Secure Access",
    desc: "Protected user authentication.",
  },
  {
    icon: <FaChartBar className="text-purple-600 text-3xl" />,
    title: "Analytics",
    desc: "View business insights instantly.",
  },
  {
    icon: <FaClock className="text-orange-500 text-3xl" />,
    title: "Real-Time",
    desc: "Instant stock updates.",
  },
  {
    icon: <FaDatabase className="text-red-500 text-3xl" />,
    title: "Cloud Storage",
    desc: "Store inventory securely.",
  },
  {
    icon: <FaUsers className="text-indigo-600 text-3xl" />,
    title: "Multi User",
    desc: "Supports multiple users.",
  },
];

function WhyChooseUs() {
  return (
    <section className="py-24 bg-gray-100">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-bold text-center">
          Why Choose Us?
        </h2>

        <p className="text-center text-gray-500 mt-4">
          Everything needed to manage inventory efficiently.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

          {benefits.map((item, index) => (

            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-xl transition"
            >

              {item.icon}

              <h3 className="text-2xl font-semibold mt-5">
                {item.title}
              </h3>

              <p className="text-gray-600 mt-3">
                {item.desc}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default WhyChooseUs;