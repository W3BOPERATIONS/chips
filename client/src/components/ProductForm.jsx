"use client"

import { useState, useEffect } from "react"

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    imageURL: "",
    description: "",
    quantity: 0, // Added quantity field
    category: "snacks", // Added category field
    inStock: true,
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        imageURL: product.imageURL || "",
        description: product.description || "",
        quantity: product.quantity || product.stock || 0, // Handle both quantity and stock
        category: product.category || "snacks", // Added category
        inStock: product.inStock !== undefined ? product.inStock : true,
      })
    }
  }, [product])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
    }

    if (!formData.price || isNaN(formData.price) || Number.parseFloat(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price"
    }

    if (!formData.imageURL.trim()) {
      newErrors.imageURL = "Image URL is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (formData.quantity < 0 || isNaN(formData.quantity)) {
      newErrors.quantity = "Please enter a valid quantity"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const productData = {
      ...formData,
      price: Number.parseFloat(formData.price),
      quantity: Number.parseInt(formData.quantity) || 0, // Parse quantity as integer
      inStock: Number.parseInt(formData.quantity) > 0, // Auto-set inStock based on quantity
    }

    onSubmit(productData)

    // Reset form if adding new product
    if (!product) {
      setFormData({
        name: "",
        price: "",
        imageURL: "",
        description: "",
        quantity: 0, // Reset quantity
        category: "snacks", // Reset category
        inStock: true,
      })
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }

    // Reset form
    setFormData({
      name: "",
      price: "",
      imageURL: "",
      description: "",
      quantity: 0, // Reset quantity
      category: "snacks", // Reset category
      inStock: true,
    })
    setErrors({})
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">{product ? "Edit Product" : "Add New Product"}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`input-field ${errors.name ? "border-red-500" : ""}`}
              placeholder="e.g., Classic Potato Chips"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className={`input-field ${errors.price ? "border-red-500" : ""}`}
              placeholder="99.00"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="0"
              className={`input-field ${errors.quantity ? "border-red-500" : ""}`}
              placeholder="100"
            />
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="snacks">Snacks</option>
              <option value="chips">Chips</option>
              <option value="beverages">Beverages</option>
              <option value="sweets">Sweets</option>
              <option value="crackers">Crackers</option>
              <option value="nuts">Nuts</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="imageURL" className="block text-sm font-medium text-gray-700 mb-2">
            Image URL *
          </label>
          <input
            type="url"
            id="imageURL"
            name="imageURL"
            value={formData.imageURL}
            onChange={handleInputChange}
            className={`input-field ${errors.imageURL ? "border-red-500" : ""}`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.imageURL && <p className="text-red-500 text-sm mt-1">{errors.imageURL}</p>}

          {formData.imageURL && (
            <div className="mt-2">
              <img
                src={formData.imageURL || "/placeholder.svg"}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = "none"
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`input-field ${errors.description ? "border-red-500" : ""}`}
            placeholder="Describe your product..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="inStock"
            name="inStock"
            checked={formData.inStock}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
            Product is in stock
          </label>
        </div>

        <div className="flex space-x-4">
          <button type="submit" className="btn-primary">
            {product ? "Update Product" : "Add Product"}
          </button>

          {(product || onCancel) && (
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default ProductForm
