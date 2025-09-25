"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"
import { toast } from "react-toastify"

const ProductDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")

  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    fetchProduct()
    fetchReviews()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/products/${id}`)
      if (!response.ok) {
        throw new Error("Product not found")
      }
      const data = await response.json()
      setProduct(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true)
      const response = await fetch(`http://localhost:5000/api/reviews/product/${id}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (err) {
      console.error("Error fetching reviews:", err)
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.info("Please sign in to leave a review", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      navigate("/login")
      return
    }

    try {
      setSubmittingReview(true)
      const token = localStorage.getItem("authToken")
      console.log("[v0] Token from localStorage:", token ? "exists" : "missing")

      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      })

      if (response.ok) {
        const newReview = await response.json()
        setReviews([newReview, ...reviews])
        setReviewForm({ rating: 5, comment: "" })
        setShowReviewForm(false)
        fetchProduct()
        toast.success("Review submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else {
        const errorData = await response.json()
        console.log("[v0] Review submission error:", errorData)
        toast.error(errorData.message || "Failed to submit review", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
    } catch (err) {
      console.error("Error submitting review:", err)
      toast.error("Failed to submit review", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const userHasReviewed = reviews.some((review) => review.user._id === user?.id)

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to add items to your cart", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      navigate("/login")
      return
    }
    addToCart(product, quantity)
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to purchase items", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      navigate("/login")
      return
    }
    addToCart(product, quantity)
    navigate("/checkout")
  }

  if (loading) return <LoadingSpinner />
  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-red-500 text-xl mb-4">❌ {error}</div>
        <button
          onClick={() => navigate("/")}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Back to Home
        </button>
      </div>
    )

  const images = product.images && product.images.length > 0 ? product.images : [product.imageURL]
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <span onClick={() => navigate("/")} className="cursor-pointer hover:text-orange-500">
          Home
        </span>
        <span className="mx-2">›</span>
        <span
          onClick={() => navigate(`/category/${product.category}`)}
          className="cursor-pointer hover:text-orange-500 capitalize"
        >
          {product.category}
        </span>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
            <img
              src={images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          {images.length > 1 && (
            <div className="flex space-x-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? "border-orange-500 shadow-lg" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {product.bestseller && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Bestseller</span>
              )}
              {product.featured && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Featured</span>
              )}
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full capitalize">
                {product.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(product.rating || product.initialRating || 0) ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-2 text-gray-600">
                  {(product.rating || product.initialRating || 0).toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-orange-600">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">{discount}% OFF</span>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            {product.stock > 0 ? (
              <>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
              </>
            ) : (
              <>
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-red-600 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                -
              </button>
              <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              Buy Now
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t pt-6">
            <div className="flex space-x-6 border-b">
              {["description", "nutrition", "details", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab} {tab === "reviews" && `(${reviews.length})`}
                </button>
              ))}
            </div>

            <div className="py-4">
              {activeTab === "description" && (
                <div>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  {product.tags && product.tags.length > 0 && (
                    <div className="mt-4">
                      <span className="font-medium text-gray-900">Tags: </span>
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-full mr-2 mt-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "nutrition" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{product.nutritionInfo?.calories || 150}</div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{product.nutritionInfo?.protein || "2g"}</div>
                    <div className="text-sm text-gray-600">Protein</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{product.nutritionInfo?.carbs || "15g"}</div>
                    <div className="text-sm text-gray-600">Carbs</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{product.nutritionInfo?.fat || "10g"}</div>
                    <div className="text-sm text-gray-600">Fat</div>
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Brand:</span>
                    <span>{product.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Weight:</span>
                    <span>{product.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Category:</span>
                    <span className="capitalize">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ingredients:</span>
                    <span className="text-right max-w-xs">{product.ingredients}</span>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {isAuthenticated && !userHasReviewed && (
                    <div className="border-b pb-4">
                      <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        {showReviewForm ? "Cancel Review" : "Write a Review"}
                      </button>
                    </div>
                  )}

                  {showReviewForm && (
                    <form onSubmit={handleSubmitReview} className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                              className={`text-2xl ${
                                star <= reviewForm.rating ? "text-yellow-400" : "text-gray-300"
                              } hover:text-yellow-400 transition-colors`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          rows={4}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Share your thoughts about this product..."
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 transition-colors"
                      >
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  )}

                  <div className="space-y-4">
                    {reviewsLoading ? (
                      <div className="text-center py-4">Loading reviews...</div>
                    ) : reviews.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No reviews yet. Be the first to review this product!</p>
                      </div>
                    ) : (
                      reviews.map((review) => (
                        <div key={review._id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{review.user.name}</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage
