"use client"

import { useState, useEffect } from "react"
import InvoiceGenerator from "./InvoiceGenerator"

const SuccessModal = ({ isOpen, onClose, orderId, orderData }) => {
  const [showInvoice, setShowInvoice] = useState(false)
  const [animationStep, setAnimationStep] = useState(0)

  useEffect(() => {
    if (isOpen) {
      // Reset animation
      setAnimationStep(0)

      // Trigger animation sequence
      const timer1 = setTimeout(() => setAnimationStep(1), 100)
      const timer2 = setTimeout(() => setAnimationStep(2), 600)
      const timer3 = setTimeout(() => setAnimationStep(3), 1200)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleViewInvoice = () => {
    setShowInvoice(true)
  }

  const handleInvoiceClose = () => {
    setShowInvoice(false)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div
          className={`bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 text-center transform transition-all duration-700 relative ${
            animationStep >= 1 ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative mb-6">
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
                animationStep >= 1 ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full animate-pulse"></div>
            </div>

            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 delay-200 ${
                animationStep >= 1 ? "scale-100 opacity-60" : "scale-0 opacity-0"
              }`}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full animate-ping"></div>
            </div>

            <div
              className={`relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg transition-all duration-700 ${
                animationStep >= 1 ? "scale-100 rotate-0" : "scale-0 rotate-180"
              }`}
            >
              <svg
                className={`w-8 h-8 text-white transition-all duration-500 delay-300 ${
                  animationStep >= 2 ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                  className="animate-[drawCheck_0.8s_ease-out_forwards]"
                />
              </svg>
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-500 ${
              animationStep >= 2 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              Order Confirmed Successfully!
            </h2>

            <p className="text-gray-700 text-base mb-2 font-medium">
              Thank you for your purchase! Your order has been confirmed and is now being processed.
            </p>

            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              We've sent a confirmation email with your invoice to{" "}
              <span className="font-semibold text-gray-800">{orderData?.email}</span>. Your premium chips will be
              carefully prepared and delivered within 2-3 business days.
            </p>
          </div>

          {orderId && (
            <div
              className={`bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4 border border-gray-200 transition-all duration-700 delay-700 ${
                animationStep >= 3 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <p className="text-xs text-gray-500 mb-1">Your Order Confirmation Number:</p>
              <p className="font-mono font-bold text-lg text-indigo-600 tracking-wider">{orderId}</p>
              <p className="text-xs text-gray-400 mt-1">Keep this number for order tracking and customer support</p>
            </div>
          )}

          <div
            className={`space-y-3 transition-all duration-700 delay-900 ${
              animationStep >= 3 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            {orderData && (
              <button
                onClick={handleViewInvoice}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>View & Download Invoice</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Continue Shopping
            </button>

            {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mt-4 border border-blue-100">
              <div className="flex items-center space-x-2 text-blue-700 mb-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="font-bold text-base">What happens next?</span>
              </div>
              <div className="grid grid-cols-1 gap-2 text-left">
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span className="text-xs">Confirmation email with PDF invoice sent to your inbox</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span className="text-xs">Order processing and quality check begins immediately</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span className="text-xs">Fast delivery within 2-3 business days</span>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes drawCheck {
          0% {
            stroke-dasharray: 0 50;
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dasharray: 50 50;
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      {showInvoice && orderData && (
        <InvoiceGenerator
          orderData={{
            ...orderData,
            orderId: orderId,
          }}
          onClose={handleInvoiceClose}
        />
      )}
    </>
  )
}

export default SuccessModal
