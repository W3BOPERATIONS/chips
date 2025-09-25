"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import ProductForm from "../components/ProductForm"
import LoadingSpinner from "../components/LoadingSpinner"
import ProductsList from "./ProductsList"
import AdminOrdersList from "./AdminOrdersList"
import { toast } from "react-toastify"

const AdminPage = () => {
  const { user, isAuthenticated, token, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  })
  const [loading, setLoading] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [dataFetched, setDataFetched] = useState(false)

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return

    // Check authentication
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    // Check admin role
    if (!user || user.role !== "admin") {
      navigate("/")
      return
    }

    // Fetch data only once when authenticated and admin
    if (token && !dataFetched) {
      fetchAllData()
    }
  }, [isAuthenticated, user, navigate, token, authLoading, dataFetched])

  const fetchAllData = async () => {
    if (!token || loading) return

    setLoading(true)
    try {
      console.log("[v0] Fetching admin data...")

      const [productsRes, ordersRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      console.log("[v0] Successfully fetched admin data")
      setProducts(productsRes.data)
      setOrders(ordersRes.data)
      setStats(statsRes.data)
      setDataFetched(true)
    } catch (error) {
      console.error("[v0] Error fetching admin data:", error)
      if (error.response?.status === 401) {
        console.log("[v0] 401 error - token invalid")
        // Don't redirect immediately, let auth context handle it
      }
    } finally {
      setLoading(false)
    }
  }

  const handleProductSubmit = async (productData) => {
    try {
      if (editingProduct) {
        // Update existing product
        const response = await axios.put(
          `http://localhost:5000/api/admin/products/${editingProduct._id}`,
          productData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        setProducts(products.map((p) => (p._id === editingProduct._id ? response.data : p)))
        setEditingProduct(null)
        toast.success("Product updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else {
        // Add new product
        const response = await axios.post("http://localhost:5000/api/admin/products", productData, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setProducts([...products, response.data])
        toast.success("Product added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }

      setActiveTab("products")
      fetchAllData() // Refresh stats
    } catch (error) {
      console.error("Error saving product:", error)
      toast.error("Failed to save product. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      await axios.delete(`http://localhost:5000/api/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setProducts(products.filter((p) => p._id !== productId))
      toast.success("Product deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      fetchAllData() // Refresh stats
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setActiveTab("add-product")
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      setOrders(orders.map((order) => (order._id === orderId ? response.data.order : order)))
      fetchAllData() // Refresh stats
      toast.success(`Order status updated to ${newStatus}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Failed to update order status.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const handleUpdateProductQuantity = async (productId, newQuantity) => {
    try {
      const product = products.find((p) => p._id === productId)
      const response = await axios.put(
        `http://localhost:5000/api/admin/products/${productId}`,
        { ...product, quantity: newQuantity, inStock: newQuantity > 0 },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      setProducts(products.map((p) => (p._id === productId ? response.data : p)))
    } catch (error) {
      console.error("Error updating product quantity:", error)
      toast.error("Failed to update product quantity.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  if (authLoading) {
    return <LoadingSpinner message="Checking authentication..." />
  }

  if (!isAuthenticated) {
    return <LoadingSpinner message="Redirecting to login..." />
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchAllData}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "dashboard", name: "Dashboard", icon: "📊" },
                { id: "products", name: `Products (${products.length})`, icon: "📦" },
                { id: "add-product", name: editingProduct ? "Edit Product" : "Add Product", icon: "➕" },
                { id: "orders", name: `Orders (${orders.length})`, icon: "🛒" },
                { id: "analytics", name: "Analytics", icon: "📈" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <LoadingSpinner message="Loading admin data..." />
            ) : (
              <>
                {/* Dashboard Tab */}
                {activeTab === "dashboard" && (
                  <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-100">Total Revenue</p>
                            <p className="text-3xl font-bold">₹{stats.totalRevenue?.toLocaleString() || 0}</p>
                          </div>
                          <div className="text-4xl">💰</div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-100">Total Orders</p>
                            <p className="text-3xl font-bold">{stats.totalOrders || 0}</p>
                          </div>
                          <div className="text-4xl">🛒</div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-100">Total Products</p>
                            <p className="text-3xl font-bold">{stats.totalProducts || 0}</p>
                          </div>
                          <div className="text-4xl">📦</div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-orange-100">Pending Orders</p>
                            <p className="text-3xl font-bold">{stats.pendingOrders || 0}</p>
                          </div>
                          <div className="text-4xl">⏳</div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h3>
                      <div className="space-y-4">
                        {stats.recentOrders?.length > 0 ? (
                          stats.recentOrders.map((order) => (
                            <div
                              key={order._id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div>
                                <p className="font-medium text-gray-900">{order.customerName || "Customer"}</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-gray-500">{order.items?.length || 0} items</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-600">
                                  ₹{order.totalAmount || order.totalPrice || 0}
                                </p>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    order.status === "delivered"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "shipped"
                                        ? "bg-blue-100 text-blue-800"
                                        : order.status === "processing"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {order.status || "pending"}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">📦</div>
                            <p>No recent orders</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Products Tab */}
                {activeTab === "products" && (
                  <ProductsList
                    products={products}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    onUpdateQuantity={handleUpdateProductQuantity}
                  />
                )}

                {/* Add/Edit Product Tab */}
                {activeTab === "add-product" && (
                  <ProductForm product={editingProduct} onSubmit={handleProductSubmit} onCancel={handleCancelEdit} />
                )}

                {/* Orders Tab */}
                {activeTab === "orders" && <AdminOrdersList orders={orders} onUpdateStatus={handleUpdateOrderStatus} />}

                {/* Analytics Tab */}
                {activeTab === "analytics" && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue Analytics</h3>
                      <div className="text-center py-12">
                        <div className="text-4xl mb-4">📊</div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics Coming Soon</h4>
                        <p className="text-gray-600">
                          Detailed charts and insights will be available in the next update.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
