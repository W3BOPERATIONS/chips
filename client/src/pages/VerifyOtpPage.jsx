"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import LoadingSpinner from "../components/LoadingSpinner"

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [timer, setTimer] = useState(300) // 5 minutes
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email")
  const inputRefs = useRef([])

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      toast.error("Invalid access. Please start from forgot password page.")
      window.location.href = "/forgot-password"
    }
  }, [email])

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return // Prevent multiple characters

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const otpString = otp.join("")
    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpString }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("OTP verified successfully!")
        // Redirect to reset password page with token
        window.location.href = `/reset-password?token=${data.resetToken}`
      } else {
        toast.error(data.message || "Invalid or expired OTP")
        // Clear OTP inputs on error
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setResendLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("New OTP sent to your email!")
        setTimer(300) // Reset timer
        setOtp(["", "", "", "", "", ""]) // Clear current OTP
        inputRefs.current[0]?.focus()
      } else {
        toast.error(data.message || "Failed to resend OTP")
      }
    } catch (error) {
      console.error("Resend OTP error:", error)
      toast.error("Network error. Please try again.")
    } finally {
      setResendLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">ChipsStore</span>
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verify OTP</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code sent to <span className="font-medium text-purple-600">{email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">Enter OTP</label>
                <div className="flex justify-center space-x-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-sm text-gray-600">
                    OTP expires in <span className="font-medium text-red-600">{formatTime(timer)}</span>
                  </p>
                ) : (
                  <p className="text-sm text-red-600 font-medium">OTP has expired</p>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <button
                type="submit"
                disabled={loading || timer === 0}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Verifying...</span>
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading || timer > 240} // Allow resend only in last minute
                className="w-full py-2 px-4 text-sm font-medium text-purple-600 hover:text-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {resendLoading ? (
                  <span className="flex items-center justify-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Resending...</span>
                  </span>
                ) : (
                  "Resend OTP"
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-500 font-medium">
                Back to Forgot Password
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VerifyOtpPage
