"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import ProductCard from "../components/ProductCard"
import LoadingSpinner from "../components/LoadingSpinner"

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("default")
  const [filterCategory, setFilterCategory] = useState("all")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(9)

  useEffect(() => {
    fetchProducts()
  }, [sortBy, filterCategory, priceRange])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortBy, filterCategory, priceRange])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const url = "/api/products?"

      const params = new URLSearchParams()
      if (sortBy !== "default") params.append("sort", sortBy)
      if (filterCategory !== "all") params.append("category", filterCategory)
      if (priceRange.min) params.append("minPrice", priceRange.min)
      if (priceRange.max) params.append("maxPrice", priceRange.max)
      if (searchTerm) params.append("search", searchTerm)

      const response = await axios.get(url + params.toString())
      setProducts(response.data)
    } catch (err) {
      setError("Failed to fetch products. Please try again later.")
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories from products
  const categories = [...new Set(products.map((product) => product.category))].filter(Boolean)

  // Filter products by search term on frontend
  const filteredProducts = products.filter((product) => {
    if (!searchTerm) return true
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts()
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading all products..." />
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12 page-transition">
        <div className="text-center glass-effect rounded-3xl p-12 max-w-md mx-auto">
          <div className="text-red-500 text-2xl mb-6 animate-bounce">⚠️</div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">{error}</h2>
          <button onClick={fetchProducts} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12 page-transition">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold gradient-text mb-4">All Products</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Discover our complete collection of premium chips and snacks
        </p>
      </div>

      {/* Search and Filters */}
      <div className="glass-effect rounded-3xl p-8 mb-12">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for chips, snacks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              />
            </div>
            <button type="submit" className="btn-primary px-8 py-4 text-lg flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>Search</span>
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center space-x-3">
            <label className="font-semibold text-slate-700">Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <label className="font-semibold text-slate-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="default">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <label className="font-semibold text-slate-700">Price Range:</label>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <span className="text-slate-500">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="glass-effect rounded-3xl p-12 max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">No products found</h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm("")
                setFilterCategory("all")
                setSortBy("default")
                setPriceRange({ min: "", max: "" })
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <p className="text-slate-600 text-lg">
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
            </p>
            <p className="text-slate-600 text-lg">
              Page {currentPage} of {totalPages}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {currentProducts.map((product, index) => (
              <div
                key={product._id}
                className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards] max-w-sm mx-auto"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous</span>
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                  // Show first page, last page, current page, and pages around current page
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === pageNumber
                            ? "bg-indigo-600 text-white"
                            : "bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                    return (
                      <span key={pageNumber} className="px-2 py-2 text-gray-500">
                        ...
                      </span>
                    )
                  }
                  return null
                })}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <span>Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProductsPage
