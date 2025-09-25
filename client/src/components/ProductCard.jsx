"use client"

import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import StarRating from "./StarRating"
import { toast } from "react-toastify"

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { isAuthenticated, toggleWishlist, user } = useAuth()
  const navigate = useNavigate()

  const [isInWishlist, setIsInWishlist] = useState(user?.wishlist?.includes(product._id) || false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user?.wishlist) {
      setIsInWishlist(user.wishlist.includes(product._id))
    } else {
      setIsInWishlist(false)
    }
  }, [user, isAuthenticated, product._id])

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate("/cart")
      return
    }
    addToCart(product)
  }

  const handleBuyNow = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate("/buy")
      return
    }
    const success = addToCart(product)
    if (success) {
      navigate("/checkout")
    }
  }

  const handleWishlistToggle = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate("/wishlist-signin")
      return
    }

    setWishlistLoading(true)
    try {
      const result = await toggleWishlist(product._id)
      if (result.success) setIsInWishlist(!isInWishlist)
    } catch (error) {
      console.error("Error toggling wishlist:", error)
      toast.error("Failed to update wishlist")
    } finally {
      setWishlistLoading(false)
    }
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const displayRating = product.rating || product.initialRating || 0

  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <img
            src={product.imageURL || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.bestseller && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md">Bestseller</span>
            )}
            {product.featured && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-md">Featured</span>
            )}
            {discount > 0 && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-md">{discount}% OFF</span>
            )}
          </div>

          {/* Stock Indicator */}
          <div className="absolute top-3 right-3">
            {product.stock > 0 ? (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium shadow">
                In Stock
              </span>
            ) : (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium shadow">
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className={`absolute bottom-3 right-3 p-3 rounded-full bg-white/90 backdrop-blur shadow-md hover:scale-110 transition-all duration-300 border border-gray-100 ${
              isInWishlist ? "bg-red-100" : ""
            }`}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {wishlistLoading ? (
              <div className="w-5 h-5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
            ) : (
              <svg
                className={`w-5 h-5 transition-colors ${
                  isInWishlist ? "text-red-500" : "text-gray-400 hover:text-red-500"
                }`}
                fill={isInWishlist ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={isInWishlist ? 0 : 2}
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Product Info */}
        <div className="p-5 flex flex-col gap-3">
          {/* Category & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full capitalize">
              {product.category}
            </span>
            <div className="bg-yellow-50 px-2 py-1 rounded-full">
              <StarRating rating={displayRating} size="w-3 h-3" />
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

          {/* Price & Buttons */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-indigo-600">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-gray-400 line-through text-sm">₹{product.originalPrice}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                  />
                </svg>
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow hover:scale-[1.03] hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
