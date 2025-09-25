"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import { toast } from "react-toastify"

const ReviewForm = ({ productId, onReviewAdded, existingReview }) => {
  const { user, isAuthenticated } = useAuth()
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [comment, setComment] = useState(existingReview?.comment || "")
  const [loading, setLoading] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast.error("Please login to add a review")
      return
    }

    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }

    if (comment.trim().length < 10) {
      toast.error("Review comment must be at least 10 characters long")
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      }

      let response
      if (existingReview) {
        response = await axios.put(
          `/api/reviews/${existingReview._id}`,
          {
            rating,
            comment,
          },
          config,
        )
        toast.success("Review updated successfully!")
      } else {
        response = await axios.post(
          "/api/reviews",
          {
            productId,
            rating,
            comment,
          },
          config,
        )
        toast.success("Review added successfully!")
      }

      onReviewAdded(response.data)
      if (!existingReview) {
        setRating(0)
        setComment("")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error(error.response?.data?.message || "Failed to submit review")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <p className="text-gray-600 mb-4">Please login to write a review</p>
        <button className="btn-primary">Login</button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {existingReview ? "Update Your Review" : "Write a Review"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-colors"
              >
                <svg
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">{rating > 0 && `${rating} star${rating > 1 ? "s" : ""}`}</span>
          </div>
        </div>

        {/* Comment Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Review Comment *</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            maxLength={500}
          />
          <div className="text-right text-xs text-gray-500 mt-1">{comment.length}/500 characters</div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || rating === 0 || comment.trim().length < 10}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {existingReview ? "Updating..." : "Submitting..."}
            </div>
          ) : existingReview ? (
            "Update Review"
          ) : (
            "Submit Review"
          )}
        </button>
      </form>
    </div>
  )
}

export default ReviewForm
