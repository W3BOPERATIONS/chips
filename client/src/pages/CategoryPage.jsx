"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import LoadingSpinner from "../components/LoadingSpinner"

const CategoryPage = () => {
  const { category } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sortBy, setSortBy] = useState("default")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })

  useEffect(() => {
    fetchProducts()
  }, [category, sortBy, priceRange])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      let url = `http://localhost:5000/api/products?category=${category}&sort=${sortBy}`

      if (priceRange.min) url += `&minPrice=${priceRange.min}`
      if (priceRange.max) url += `&maxPrice=${priceRange.max}`

      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch products")

      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const categoryNames = {
    all: "All Products",
    spicy: "Spicy Chips",
    sweet: "Sweet Treats",
    salty: "Salty Snacks",
    healthy: "Healthy Options",
    premium: "Premium Collection",
    combo: "Combo Packs",
  }

  const categoryIcons = {
    all: "🍿",
    spicy: "🌶️",
    sweet: "🍯",
    salty: "🧂",
    healthy: "🥗",
    premium: "👑",
    combo: "📦",
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{categoryIcons[category] || "🍿"}</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{categoryNames[category] || "Products"}</h1>
        <p className="text-gray-600">Discover our amazing collection of {categoryNames[category]?.toLowerCase()}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="default">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <label className="font-medium text-gray-700">Price Range:</label>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 w-20 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 w-20 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {error ? (
        <div className="text-center py-12">
          <div className="text-red-500 text-xl mb-4">❌ {error}</div>
          <button
            onClick={() => navigate("/")}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your filters or browse other categories</p>
          <button
            onClick={() => navigate("/")}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Browse All Products
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">{products.length} products found</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default CategoryPage
