"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products/categories")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        setCategories(data)
      } else {
        setCategories([])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      setCategories([])
    }
  }

  const mainMenuItems = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "All Products", path: "/products", icon: "🛍️" },
    { name: "Cart", path: "/cart", icon: "🛒" },
    { name: "Orders", path: "/orders", icon: "📦" },
    { name: "Wishlist", path: "/wishlist", icon: "❤️" },
    { name: "Profile", path: "/profile", icon: "👤" },
  ]

  const accountMenuItems = [
    { name: "About Us", path: "/about", icon: "ℹ️" },
    { name: "Contact", path: "/contact", icon: "📞" },
  ]

  const isActivePath = (path) => {
    return location.pathname === path
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 sm:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">ChipsStore</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
            aria-label="Close sidebar"
          >
            <svg
              className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        {isAuthenticated && (
          <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{user?.name || "User"}</p>
                <p className="text-xs sm:text-sm text-gray-600 truncate">{user?.email}</p>
                {user?.role === "admin" && (
                  <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full mt-1">
                    Administrator
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1">
          {/* Main Menu */}
          <div className="p-3 sm:p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Main Menu</h3>
            <nav className="space-y-1">
              {mainMenuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 ${
                    isActivePath(item.path)
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                  }`}
                >
                  <span className="text-base sm:text-lg">{item.icon}</span>
                  <span className="font-medium text-sm sm:text-base">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div className="p-3 sm:p-4 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Categories</h3>
            <nav className="space-y-1">
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    onClick={onClose}
                    className={`flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 ${
                      location.pathname === `/category/${category.id}`
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                    }`}
                  >
                    <span className="text-base sm:text-lg">{category.icon}</span>
                    <span className="font-medium text-sm sm:text-base truncate">{category.name}</span>
                  </Link>
                ))}
            </nav>
          </div>

          {/* Account & Support */}
          <div className="p-3 sm:p-4 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Account & Support</h3>
            <nav className="space-y-1">
              {accountMenuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 ${
                    isActivePath(item.path)
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                  }`}
                >
                  <span className="text-base sm:text-lg">{item.icon}</span>
                  <span className="font-medium text-sm sm:text-base">{item.name}</span>
                </Link>
              ))}

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 ${
                    isActivePath("/admin")
                      ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
                      : "text-red-600 hover:bg-red-50 hover:text-red-700"
                  }`}
                >
                  <span className="text-base sm:text-lg">⚙️</span>
                  <span className="font-medium text-sm sm:text-base">Admin Dashboard</span>
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">© 2024 ChipsStore</p>
            <p className="text-xs text-gray-400">Premium Chips & Snacks</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
