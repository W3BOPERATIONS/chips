"use client"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import CartItem from "../components/CartItem"

const CartPage = () => {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full transition-all duration-1000 opacity-100 translate-y-0">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-indigo-100">
            {/* Animated Icon */}
            <div className="mb-6 relative">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-10 h-10 text-white animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                  />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-xs">🛒</span>
              </div>
            </div>

            {/* Main Message */}
            <h1 className="text-2xl font-bold text-gray-800 mb-3">Ready to Add to Cart? 🛍️</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Hey there, chip lover! To add delicious items to your cart and start your snacking journey,
              <br />
              <span className="font-semibold text-indigo-600">you'll need to sign in first.</span>
            </p>

            {/* Decorative Elements */}
            <div className="flex justify-center gap-2 mb-6">
              <span className="text-2xl animate-bounce" style={{ animationDelay: "0ms" }}>
                🥔
              </span>
              <span className="text-2xl animate-bounce" style={{ animationDelay: "200ms" }}>
                🌽
              </span>
              <span className="text-2xl animate-bounce" style={{ animationDelay: "400ms" }}>
                🥨
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to="/login"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                </svg>
                Sign In & Add to Cart
              </Link>

              <Link
                to="/register"
                className="w-full bg-white text-indigo-600 font-semibold py-3 px-6 rounded-xl border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Create Account
              </Link>
            </div>

            {/* Footer Message */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                New here? Join thousands of happy customers!
                <br />
                <span className="text-indigo-600 font-medium">Free delivery on first order 🚚</span>
              </p>
            </div>

            {/* Back to Shopping */}
            <Link to="/" className="inline-block mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12 page-transition">
        <div className="text-center py-20">
          <div className="glass-effect rounded-3xl p-12 max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-8 floating-animation">
              <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-4">Your cart is empty</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Looks like you haven't added any delicious chips to your cart yet.
            </p>
            <Link to="/" className="btn-primary inline-flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12 page-transition">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold gradient-text">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-8 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">
                Cart Items ({getTotalItems()} {getTotalItems() === 1 ? "item" : "items"})
              </h2>
            </div>

            <div className="divide-y divide-slate-200">
              {items.map((item, index) => (
                <div
                  key={item._id}
                  className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CartItem item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-effect rounded-3xl p-8 sticky top-24">
            <h2 className="text-2xl font-bold gradient-text mb-8">Order Summary</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({getTotalItems()} items)</span>
                <span className="font-semibold">₹{getTotalPrice().toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Tax</span>
                <span className="font-semibold">₹{(getTotalPrice() * 0.08).toFixed(2)}</span>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between text-2xl font-bold gradient-text">
                  <span>Total</span>
                  <span>₹{(getTotalPrice() * 1.08).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Link to="/checkout" className="w-full btn-primary text-center block text-lg py-4">
                Proceed to Checkout
              </Link>

              <Link to="/" className="w-full btn-secondary text-center block text-lg py-4">
                Continue Shopping
              </Link>
            </div>

            {/* Security Badge */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-3 text-slate-500 bg-green-50 rounded-2xl p-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="font-semibold text-green-700">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
