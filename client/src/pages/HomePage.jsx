"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import ProductCard from "../components/ProductCard"
import LoadingSpinner from "../components/LoadingSpinner"
import BackgroundCarousel from "../components/BackgroundCarousel"

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      navigate("/admin")
    }
  }, [isAuthenticated, user, navigate])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/products")
      setProducts(response.data)
    } catch (err) {
      setError("Failed to fetch products. Please try again later.")
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading delicious chips..." />
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 page-transition">
        <div className="text-center glass-effect rounded-2xl sm:rounded-3xl p-8 sm:p-12 max-w-md mx-auto">
          <div className="text-red-500 text-2xl mb-6 animate-bounce">⚠️</div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">{error}</h2>
          <button onClick={fetchProducts} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-transition">
      {/* Hero Section with Background Carousel */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 py-8 sm:py-12 lg:py-16 min-h-[500px] sm:min-h-[550px] lg:min-h-[600px]">
        {/* Background Carousel Component */}
        <BackgroundCarousel />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
          <div className="floating-animation">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6">
              Premium <span className="gradient-text">Chips</span> Store
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
              Discover our collection of crispy, flavorful chips made from the finest ingredients. Perfect for snacking,
              parties, or any time you crave something delicious!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link to="/products" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                Shop Now
              </Link>
              <Link to="/about" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Featured Categories Section */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-4">Shop by Category</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Explore our diverse range of premium snacks
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <Link to="/products?category=potato-chips" className="group">
              <div className="glass-effect rounded-2xl p-6 text-center hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-3">🥔</div>
                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600">Potato Chips</h3>
              </div>
            </Link>
            <Link to="/products?category=veggie-chips" className="group">
              <div className="glass-effect rounded-2xl p-6 text-center hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-3">🥕</div>
                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600">Veggie Chips</h3>
              </div>
            </Link>
            <Link to="/products?category=protein-chips" className="group">
              <div className="glass-effect rounded-2xl p-6 text-center hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-3">💪</div>
                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600">Protein Chips</h3>
              </div>
            </Link>
            <Link to="/products?category=healthy-snacks" className="group">
              <div className="glass-effect rounded-2xl p-6 text-center hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-3">🌱</div>
                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600">Healthy Snacks</h3>
              </div>
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-4">Featured Products</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Handcrafted with love, delivered with care
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="glass-effect rounded-2xl sm:rounded-3xl p-8 sm:p-12 max-w-md mx-auto">
                <div className="text-4xl sm:text-6xl mb-4">🥔</div>
                <p className="text-slate-600 text-base sm:text-lg">No products available at the moment.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
                {products.slice(0, 6).map((product, index) => (
                  <div
                    key={product._id}
                    className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards] max-w-sm mx-auto"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {products.length > 6 && (
                <div className="text-center mt-8 sm:mt-12">
                  <Link
                    to="/products"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                  >
                    <span>View All Products</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Testimonials Section */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-4">What Our Customers Say</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">Don't just take our word for it</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="glass-effect rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 text-lg">★★★★★</div>
              </div>
              <p className="text-slate-600 mb-4 italic">
                "The best chips I've ever tasted! The quality is outstanding and the flavors are incredible."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  S
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Sarah Johnson</p>
                  <p className="text-sm text-slate-500">Verified Customer</p>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 text-lg">★★★★★</div>
              </div>
              <p className="text-slate-600 mb-4 italic">
                "Fast delivery and amazing packaging. The chips arrived fresh and crispy. Highly recommended!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  M
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Mike Chen</p>
                  <p className="text-sm text-slate-500">Verified Customer</p>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 text-lg">★★★★★</div>
              </div>
              <p className="text-slate-600 mb-4 italic">
                "Love the variety of healthy options. Perfect for my fitness goals without compromising on taste!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  A
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Anna Rodriguez</p>
                  <p className="text-sm text-slate-500">Verified Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup Section */}
        <div className="mb-16 sm:mb-20">
          <div className="glass-effect rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-br from-indigo-50 to-purple-50">
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-4">Stay Updated</h2>
            <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive offers, new product launches, and snacking tips!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button className="btn-primary px-6 py-3 whitespace-nowrap">Subscribe</button>
            </div>
            <p className="text-sm text-slate-500 mt-3">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>

        {/* Features Section */}
        <div className="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 mt-12 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center gradient-text mb-8 sm:mb-12">
            Why Choose ChipsStore?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                <span className="text-2xl sm:text-3xl">🥔</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">Premium Quality</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Made from the finest potatoes and ingredients for the perfect crunch.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                <span className="text-2xl sm:text-3xl">🚚</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">Fast Delivery</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Quick and reliable delivery to get your snacks to you fresh.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                <span className="text-2xl sm:text-3xl">💯</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">100% Satisfaction</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                We guarantee you'll love our chips or your money back.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 sm:mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">50K+</div>
              <p className="text-slate-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">25+</div>
              <p className="text-slate-600">Chip Varieties</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">99%</div>
              <p className="text-slate-600">Satisfaction Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">24/7</div>
              <p className="text-slate-600">Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
