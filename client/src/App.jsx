"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import { AuthProvider } from "./context/AuthContext"
import { useState } from "react"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import CartPage from "./pages/CartPage"
import CheckoutPage from "./pages/CheckoutPage"
import AdminPage from "./pages/AdminPage"
import ProductDetailsPage from "./pages/ProductDetailsPage"
import CategoryPage from "./pages/CategoryPage"
import SearchPage from "./pages/SearchPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import OrdersPage from "./pages/OrdersPage"
import TrackOrderPage from "./pages/TrackOrderPage"
import WishlistPage from "./pages/WishlistPage"
import ProductsPage from "./pages/ProductsPage"
import BuyPage from "./pages/BuyPage"
import ScrollToTop from "./components/ScrollToTop"
import WishlistSignInPage from "./pages/WishlistSignInPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import VerifyOtpPage from "./pages/VerifyOtpPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./index.css"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-gray-50 flex">
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "lg:ml-80" : "lg:ml-0"}`}>
              <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/buy" element={<BuyPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/track-order/:orderId" element={<TrackOrderPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/wishlist-signin" element={<WishlistSignInPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/verify-otp" element={<VerifyOtpPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
