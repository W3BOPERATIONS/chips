"use client"

import { Link } from "react-router-dom"

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      image: "/professional-indian-man-founder.jpg",
      description: "Passionate about bringing authentic Indian snacks to the world.",
    },
    {
      name: "Priya Sharma",
      role: "Head of Operations",
      image: "/professional-indian-woman-operations.jpg",
      description: "Ensures quality and freshness in every product we deliver.",
    },
    {
      name: "Amit Patel",
      role: "Product Manager",
      image: "/professional-indian-man-product-manager.jpg",
      description: "Curates the best snacks from across India for our customers.",
    },
  ]

  const values = [
    {
      icon: "🌟",
      title: "Quality First",
      description:
        "We source only the finest ingredients and work with trusted manufacturers to ensure every bite is perfect.",
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Fresh snacks delivered to your doorstep within 24-48 hours across major cities.",
    },
    {
      icon: "💚",
      title: "Authentic Taste",
      description: "Traditional recipes and authentic flavors that remind you of home-made goodness.",
    },
    {
      icon: "🤝",
      title: "Customer First",
      description: "Your satisfaction is our priority. We're here to make your snacking experience delightful.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">About ChipsStore</h1>
            <p className="text-xl leading-relaxed mb-8">
              We're passionate about bringing you the finest selection of chips and snacks from across India. Founded in
              2020, ChipsStore has become the go-to destination for authentic, delicious, and high-quality snacks that
              satisfy every craving.
            </p>
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-3xl font-bold">10,000+</div>
                <div className="text-indigo-200">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-indigo-200">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-indigo-200">Cities Served</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                ChipsStore was born from a simple idea: everyone deserves access to delicious, authentic snacks that
                bring joy to their day. Our founder, Rajesh Kumar, started this journey from his small kitchen in
                Mumbai, experimenting with traditional recipes and modern flavors.
              </p>
              <p>
                What began as a passion project quickly grew into something bigger. We realized that people everywhere
                were craving authentic, high-quality snacks that reminded them of home or introduced them to new flavors
                from across India.
              </p>
              <p>
                Today, we work with over 100 local manufacturers and artisans across India to bring you the most diverse
                and delicious collection of chips, namkeens, and snacks. Every product is carefully selected, tested,
                and approved by our team before it reaches your table.
              </p>
            </div>
          </div>
          <div className="relative">
            <img src="/indian-snacks-manufacturing-traditional-kitchen.jpg" alt="Our Story" className="rounded-2xl shadow-2xl" />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="text-2xl font-bold text-indigo-600">Since 2020</div>
              <div className="text-gray-600">Serving Quality Snacks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do, from sourcing ingredients to delivering your order.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The passionate people behind ChipsStore who work tirelessly to bring you the best snacking experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <div className="text-indigo-600 font-medium mb-3">{member.role}</div>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl leading-relaxed max-w-4xl mx-auto mb-8">
            To make authentic, high-quality Indian snacks accessible to everyone, everywhere. We believe that great
            snacks have the power to bring people together, create memories, and add joy to everyday moments.
          </p>
          <Link
            to="/"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105 duration-300"
          >
            Start Shopping
          </Link>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Have Questions?</h2>
        <p className="text-xl text-gray-600 mb-8">We'd love to hear from you. Get in touch with our friendly team.</p>
        <Link
          to="/contact"
          className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 duration-300"
        >
          Contact Us
        </Link>
      </div>
    </div>
  )
}

export default AboutPage
