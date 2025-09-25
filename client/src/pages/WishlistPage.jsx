"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { Link, useNavigate } from "react-router-dom"
import LoadingSpinner from "../components/LoadingSpinner"
import StarRating from "../components/StarRating"
import { toast } from "react-toastify"

const WishlistPage = () => {
  const { user, isAuthenticated, toggleWishlist, token } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/wishlist-signin")
      return
    }
    fetchWishlistItems()
  }, [isAuthenticated, navigate, user])

  const fetchWishlistItems = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("http://localhost:5000/api/auth/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist")
      }

      const data = await response.json()
      setWishlistItems(data.wishlist || [])
    } catch (err) {
      setError("Failed to load wishlist items")
      console.error("Error fetching wishlist:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const result = await toggleWishlist(productId)
      if (result.success) {
        setWishlistItems((prev) => prev.filter((item) => item._id !== productId))
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error)
    }
  }

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  const handleMoveToCart = async (product) => {
    addToCart(product)
    await handleRemoveFromWishlist(product._id)
  }

  const handleWishlistToggle = async (productId) => {
    if (!isAuthenticated) {
      navigate("/wishlist-signin")
      return
    }
    // Existing code here
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-4">My Wishlist</h1>
            <p className="text-gray-600 text-base sm:text-lg">
              {wishlistItems.length > 0
                ? `${wishlistItems.length} item${wishlistItems.length > 1 ? "s" : ""} saved for later`
                : "Save your favorite items for later"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 sm:mb-8 mx-4 sm:mx-0">
              <div className="flex items-center space-x-2 text-red-700">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm sm:text-base">{error}</span>
              </div>
            </div>
          )}

          {wishlistItems.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                Discover amazing products and save your favorites by clicking the heart icon on any product.
              </p>
              <Link
                to="/"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2 text-sm sm:text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Start Shopping</span>
              </Link>
            </div>
          ) : (
            <>
              {/* Wishlist Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 px-4 sm:px-0">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      wishlistItems.forEach((item) => addToCart(item))
                      toast.success("All items added to cart!")
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>Add All to Cart</span>
                  </button>
                </div>

                <div className="text-xs sm:text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
                {wishlistItems.map((item, index) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards] flex flex-col h-full"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative overflow-hidden">
                      <Link to={`/product/${item._id}`}>
                        <img
                          src={item.imageURL || "/placeholder.svg?height=300&width=300&query=chips"}
                          alt={item.name}
                          className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </Link>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Badges */}
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col space-y-1 sm:space-y-2">
                        {item.bestseller && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Bestseller
                          </span>
                        )}
                        {item.featured && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Featured
                          </span>
                        )}
                        {item.originalPrice && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>

                      {/* Remove from Wishlist */}
                      <button
                        onClick={() => handleRemoveFromWishlist(item._id)}
                        className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-red-50 transition-all duration-300 group/btn"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 group-hover/btn:scale-110 transition-transform"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>
                    </div>

                    <div className="p-4 sm:p-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium capitalize">
                          {item.category}
                        </span>
                        <div className="bg-yellow-50 px-2 py-1 rounded-full">
                          <StarRating rating={item.rating || 4.0} size="w-3 h-3" />
                        </div>
                      </div>

                      <Link to={`/product/${item._id}`}>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>

                      <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl sm:text-2xl font-bold text-indigo-600">₹{item.price}</span>
                          {item.originalPrice && (
                            <span className="text-sm sm:text-lg text-gray-500 line-through">₹{item.originalPrice}</span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {item.stock > 0 ? (
                            <>
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              <span className="text-xs text-green-600 font-medium">In Stock</span>
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-auto">
                        <button
                          onClick={() => handleMoveToCart(item)}
                          disabled={item.stock === 0}
                          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          <span>Move to Cart</span>
                        </button>

                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={item.stock === 0}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-3 sm:px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="text-center mt-8 sm:mt-12 px-4 sm:px-0">
                <Link
                  to="/"
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2 text-sm sm:text-base"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default WishlistPage
