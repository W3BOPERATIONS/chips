"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"

const WishlistSignInPage = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    setShowAnimation(true)
  }, [])

  const handleSignIn = () => {
    navigate("/login")
  }

  const handleSignUp = () => {
    navigate("/register")
  }

  if (isAuthenticated) {
    navigate("/wishlist")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-rose-50 flex items-center justify-center p-4">
      <div
        className={`max-w-md w-full transition-all duration-1000 ${showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-pink-100">
          {/* Animated Icon */}
          <div className="mb-6 relative">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-xs">💖</span>
            </div>
          </div>

          {/* Main Message */}
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Save Your Favorites! ❤️</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Create your personal wishlist of delicious chips and snacks!
            <br />
            <span className="font-semibold text-pink-600">Sign in to start saving your favorites.</span>
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
            <button
              onClick={handleSignIn}
              className="w-full bg-gradient-to-r from-pink-500 to-red-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Sign In & Save Favorites
            </button>

            <button
              onClick={handleSignUp}
              className="w-full bg-white text-pink-600 font-semibold py-3 px-6 rounded-xl border-2 border-pink-200 hover:bg-pink-50 hover:border-pink-300 transition-all duration-300 flex items-center justify-center gap-2"
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
            </button>
          </div>

          {/* Footer Message */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              New here? Join thousands of happy customers!
              <br />
              <span className="text-pink-600 font-medium">Save unlimited favorites 💕</span>
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

export default WishlistSignInPage
