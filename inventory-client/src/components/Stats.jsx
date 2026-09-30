import {
  FaBoxes,
  FaUsers,
  FaChartLine,
  FaClock,
} from "react-icons/fa";

function Stats() {
  const stats = [
    {
      icon: <FaBoxes />,
      number: "500+",
      title: "Products",
    },
    {
      icon: <FaUsers />,
      number: "120+",
      title: "Businesses",
    },
    {
      icon: <FaChartLine />,
      number: "99%",
      title: "Accuracy",
    },
    {
      icon: <FaClock />,
      number: "24/7",
      title: "Support",
    },
  ];

  return (
    <section className="py-20 bg-blue-700 text-white">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-14">
          Our Numbers
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((item, index) => (

            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center hover:scale-105 transition duration-300"
            >

              <div className="text-5xl flex justify-center mb-4">
                {item.icon}
              </div>

              <h1 className="text-5xl font-bold">
                {item.number}
              </h1>

              <p className="mt-3 text-lg">
                {item.title}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Stats;