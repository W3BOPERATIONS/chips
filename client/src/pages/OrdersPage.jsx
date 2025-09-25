"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import LoadingSpinner from "../components/LoadingSpinner"
import axios from "axios"
import { toast } from "react-toastify"

const OrdersPage = () => {
  const { user, isAuthenticated, token } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")
  const [cancellingOrder, setCancellingOrder] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    fetchOrders()
  }, [isAuthenticated, navigate, token])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      if (user?.email) {
        const response = await axios.get(`http://localhost:5000/api/orders/user/${user.email}`)
        setOrders(response.data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true
    return order.status === activeFilter
  })

  const cancelOrder = async (orderId) => {
    try {
      setCancellingOrder(orderId)
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.data.success) {
        setOrders(orders.map((order) => (order._id === orderId ? { ...order, status: "cancelled" } : order)))
        toast.success("Order cancelled successfully!")
      }
    } catch (error) {
      console.error("Error cancelling order:", error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed to cancel order. Please try again.")
      }
    } finally {
      setCancellingOrder(null)
    }
  }

  const canCancelOrder = (orderDate, status) => {
    if (status === "delivered" || status === "cancelled") return false
    const orderTime = new Date(orderDate).getTime()
    const currentTime = new Date().getTime()
    const timeDiff = currentTime - orderTime
    const hoursDiff = timeDiff / (1000 * 60 * 60)
    return hoursDiff <= 24
  }

  const viewOrderDetails = (order) => {
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900">Order Details</h2>
            <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
        </div>
        
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Order ID</p>
              <p class="font-semibold">#${order._id.slice(-8)}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Status</p>
              <span class="inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}">${order.status}</span>
            </div>
            <div>
              <p class="text-sm text-gray-600">Order Date</p>
              <p class="font-semibold">${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Total Amount</p>
              <p class="font-semibold text-lg">₹${order.totalAmount}</p>
            </div>
          </div>
          
          <div>
            <p class="text-sm text-gray-600 mb-2">Delivery Address</p>
            <p class="font-semibold">${order.address}</p>
          </div>
          
          <div>
            <p class="text-sm text-gray-600 mb-2">Contact</p>
            <p class="font-semibold">${order.phone}</p>
          </div>
          
          <div>
            <p class="text-sm text-gray-600 mb-2">Payment Method</p>
            <p class="font-semibold capitalize">${order.paymentMethod}</p>
          </div>
          
          <div>
            <p class="text-sm text-gray-600 mb-3">Items Ordered</p>
            <div class="space-y-3">
              ${order.items
                .map(
                  (item) => `
                <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <img src="${item.imageURL || "/placeholder.svg"}" alt="${item.name}" class="w-12 h-12 object-cover rounded-lg">
                  <div class="flex-1">
                    <h4 class="font-medium">${item.name}</h4>
                    <p class="text-sm text-gray-600">Quantity: ${item.quantity}</p>
                  </div>
                  <p class="font-semibold">₹${item.price}</p>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        </div>
        
        <div class="p-6 border-t border-gray-200 bg-gray-50">
          <button onclick="this.closest('.fixed').remove()" class="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    `
    document.body.appendChild(modal)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: "all", name: "All Orders", count: orders.length },
                  {
                    id: "processing",
                    name: "Processing",
                    count: orders.filter((o) => o.status === "processing").length,
                  },
                  { id: "shipped", name: "Shipped", count: orders.filter((o) => o.status === "shipped").length },
                  { id: "delivered", name: "Delivered", count: orders.filter((o) => o.status === "delivered").length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeFilter === tab.id
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.name} ({tab.count})
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">
                {activeFilter === "all"
                  ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                  : `No ${activeFilter} orders found.`}
              </p>
              <Link
                to="/"
                className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 duration-300"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
                          <p className="text-sm text-gray-600">
                            Placed on{" "}
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">₹{order.totalAmount}</p>
                          <p className="text-sm text-gray-600">{order.items.length} items</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <img
                            src={item.imageURL || "/placeholder.svg"}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-gray-900">₹{item.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="text-sm text-gray-600">
                        <p>Delivering to: {order.address}</p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
                        >
                          View Details
                        </button>
                        {order.status === "delivered" && (
                          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                            Reorder
                          </button>
                        )}
                        {canCancelOrder(order.createdAt, order.status) && (
                          <button
                            onClick={() => cancelOrder(order._id)}
                            disabled={cancellingOrder === order._id}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancellingOrder === order._id ? "Cancelling..." : "Cancel Order"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrdersPage
