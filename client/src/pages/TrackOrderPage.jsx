"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"

const TrackOrderPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    fetchOrderDetails()
  }, [orderId, isAuthenticated, navigate])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      // Mock order data - in real app, fetch from API
      const mockOrder = {
        _id: orderId,
        orderNumber: "CHI-2024-001",
        status: "delivered",
        totalPrice: 450,
        createdAt: "2024-01-15T10:30:00Z",
        deliveredAt: "2024-01-17T14:20:00Z",
        estimatedDelivery: "2024-01-18T18:00:00Z",
        items: [
          { name: "Classic Salted Chips", quantity: 2, price: 120, image: "/placeholder.svg" },
          { name: "Spicy Masala Mix", quantity: 1, price: 210, image: "/placeholder.svg" },
        ],
        shippingAddress: {
          name: "John Doe",
          street: "123 Main Street",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400001",
          phone: "+91 98765 43210",
        },
        trackingSteps: [
          {
            status: "Order Placed",
            date: "2024-01-15T10:30:00Z",
            completed: true,
            description: "Your order has been placed successfully",
          },
          {
            status: "Order Confirmed",
            date: "2024-01-15T11:00:00Z",
            completed: true,
            description: "Order confirmed and payment received",
          },
          {
            status: "Preparing",
            date: "2024-01-16T09:00:00Z",
            completed: true,
            description: "Your order is being prepared for shipment",
          },
          {
            status: "Shipped",
            date: "2024-01-16T16:00:00Z",
            completed: true,
            description: "Order shipped from our warehouse",
          },
          {
            status: "Out for Delivery",
            date: "2024-01-17T10:00:00Z",
            completed: true,
            description: "Order is out for delivery",
          },
          {
            status: "Delivered",
            date: "2024-01-17T14:20:00Z",
            completed: true,
            description: "Order delivered successfully",
          },
        ],
        trackingNumber: "TRK123456789",
        courier: "ChipsExpress Delivery",
      }

      setOrder(mockOrder)
    } catch (error) {
      console.error("Error fetching order details:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status, completed) => {
    if (completed) {
      return (
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )
    } else {
      return (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
        </div>
      )
    }
  }

  if (loading) return <LoadingSpinner />

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link
            to="/orders"
            className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to="/orders" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Orders
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Order</h1>
            <p className="text-gray-600">Order #{order.orderNumber}</p>
          </div>

          {/* Order Status Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Status</h2>
                <p className="text-gray-600">
                  {order.status === "delivered"
                    ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString("en-IN")}`
                    : `Estimated delivery: ${new Date(order.estimatedDelivery).toLocaleDateString("en-IN")}`}
                </p>
              </div>
              <div className="mt-4 lg:mt-0">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                  <p className="font-mono font-bold text-lg">{order.trackingNumber}</p>
                  <p className="text-sm text-gray-600 mt-1">via {order.courier}</p>
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {order.trackingSteps.map((step, index) => (
                  <div key={index} className="relative flex items-start">
                    <div className="relative z-10">{getStatusIcon(step.status, step.completed)}</div>
                    <div className="ml-4 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className={`font-semibold ${step.completed ? "text-gray-900" : "text-gray-500"}`}>
                            {step.status}
                          </h3>
                          <p className={`text-sm ${step.completed ? "text-gray-600" : "text-gray-400"}`}>
                            {step.description}
                          </p>
                        </div>
                        {step.date && (
                          <p className={`text-sm mt-1 sm:mt-0 ${step.completed ? "text-gray-600" : "text-gray-400"}`}>
                            {new Date(step.date).toLocaleString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">₹{item.price}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">₹{order.totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                  <div className="text-gray-600">
                    <p>{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.phone}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="text-gray-900">{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="text-gray-900">Cash on Delivery</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Charges:</span>
                      <span className="text-green-600">Free</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {order.status === "delivered" && (
                  <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                    Reorder Items
                  </button>
                )}
                {order.status !== "delivered" && order.status !== "cancelled" && (
                  <button className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                    Cancel Order
                  </button>
                )}
                <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackOrderPage
