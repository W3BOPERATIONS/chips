"use client"

import { useState } from "react"
import { toast } from "react-toastify"

const PaymentModal = ({ isOpen, onClose, onSuccess, orderData }) => {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [processing, setProcessing] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })
  const [upiId, setUpiId] = useState("")

  if (!isOpen) return null

  const handleCardInputChange = (e) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === "cardNumber") {
      // Format card number with spaces
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
      if (formattedValue.length > 19) return
    } else if (name === "expiryDate") {
      // Format expiry date as MM/YY
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2")
      if (formattedValue.length > 5) return
    } else if (name === "cvv") {
      // Only allow 3-4 digits
      formattedValue = value.replace(/\D/g, "")
      if (formattedValue.length > 4) return
    }

    setCardDetails((prev) => ({
      ...prev,
      [name]: formattedValue,
    }))
  }

  const simulatePayment = async () => {
    setProcessing(true)

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Simulate payment success (90% success rate)
    const isSuccess = Math.random() > 0.1

    if (isSuccess) {
      const paymentDetails = {
        method: paymentMethod,
        transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
        amount: orderData?.totalAmount || 0,
        status: "completed",
        timestamp: new Date().toISOString(),
        ...(paymentMethod === "card" && {
          cardLast4: cardDetails.cardNumber.slice(-4).replace(/\s/g, ""),
        }),
        ...(paymentMethod === "upi" && {
          upiId: upiId,
        }),
      }

      onSuccess(paymentDetails)
    } else {
      toast.error("Payment failed. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }

    setProcessing(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (paymentMethod === "card") {
      if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardholderName) {
        toast.error("Please fill in all card details", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        return
      }
    } else if (paymentMethod === "upi") {
      if (!upiId) {
        toast.error("Please enter your UPI ID", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        return
      }
    }

    simulatePayment()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={processing}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Order Total</h3>
            <div className="text-2xl font-bold text-indigo-600">₹{orderData?.totalAmount?.toFixed(2) || 0}</div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3 text-indigo-600"
                  disabled={processing}
                />
                <div className="flex items-center space-x-3">
                  <span className="text-xl">💳</span>
                  <span className="font-medium">Credit/Debit Card</span>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3 text-indigo-600"
                  disabled={processing}
                />
                <div className="flex items-center space-x-3">
                  <span className="text-xl">📱</span>
                  <span className="font-medium">UPI Payment</span>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="wallet"
                  checked={paymentMethod === "wallet"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3 text-indigo-600"
                  disabled={processing}
                />
                <div className="flex items-center space-x-3">
                  <span className="text-xl">👛</span>
                  <span className="font-medium">Digital Wallet</span>
                </div>
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Card Payment Form */}
            {paymentMethod === "card" && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={processing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={cardDetails.expiryDate}
                      onChange={handleCardInputChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={processing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardInputChange}
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={processing}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={cardDetails.cardholderName}
                    onChange={handleCardInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={processing}
                  />
                </div>
              </div>
            )}

            {/* UPI Payment Form */}
            {paymentMethod === "upi" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={processing}
                />
              </div>
            )}

            {/* Wallet Payment */}
            {paymentMethod === "wallet" && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-center">
                  You will be redirected to your wallet app to complete the payment.
                </p>
              </div>
            )}

            {/* Demo Notice */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-yellow-800 font-medium">Demo Payment</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    This is a demo payment system. No real money will be charged.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Pay ₹{orderData?.totalAmount?.toFixed(2) || 0}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
