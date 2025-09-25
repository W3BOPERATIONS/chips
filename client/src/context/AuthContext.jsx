"use client"

import { createContext, useContext, useReducer, useEffect, useCallback } from "react"
import { toast } from "react-toastify"

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("authToken")
      const user = localStorage.getItem("authUser")

      if (token && user) {
        try {
          const parsedUser = JSON.parse(user)
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              token,
              user: parsedUser,
            },
          })
        } catch (error) {
          console.error("Error parsing stored user data:", error)
          localStorage.removeItem("authToken")
          localStorage.removeItem("authUser")
          dispatch({ type: "SET_LOADING", payload: false })
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    initializeAuth()
  }, []) // Empty dependency array is correct here

  useEffect(() => {
    if (state.isAuthenticated && state.token && state.user && !state.loading) {
      localStorage.setItem("authToken", state.token)
      localStorage.setItem("authUser", JSON.stringify(state.user))
    } else if (!state.isAuthenticated && !state.loading) {
      localStorage.removeItem("authToken")
      localStorage.removeItem("authUser")
    }
  }, [state.isAuthenticated, state.token, state.user, state.loading])

  const login = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "CLEAR_ERROR" })

      if (!email || !email.trim()) {
        toast.error("Please enter your email address")
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: false, error: "Email is required" }
      }

      if (!password || !password.trim()) {
        toast.error("Please enter your password")
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: false, error: "Password is required" }
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.trim())) {
        toast.error("Please enter a valid email address")
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: false, error: "Invalid email format" }
      }

      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long")
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: false, error: "Password too short" }
      }

      // Admin login check
      if (email === "admin@chipsstore.com" && password === "admin123") {
        const response = await fetch("http://localhost:5000/api/auth/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: "admin", password: "admin123" }),
        })

        const data = await response.json()

        if (!response.ok) {
          toast.error("Invalid admin credentials. Please check your email and password.")
          throw new Error(data.message || "Admin login failed")
        }

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            token: data.token,
            user: { ...data.user, role: "admin" },
          },
        })

        toast.success("Welcome back, Admin!")
        return { success: true, message: data.message, isAdmin: true }
      }

      // Regular user login
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Invalid email or password. Please check your credentials and try again.")
        } else if (response.status === 404) {
          toast.error("No account found with this email address. Please sign up first.")
        } else {
          toast.error("Login failed. Please try again later.")
        }
        throw new Error(data.message || "Login failed")
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token: data.token,
          user: data.user,
        },
      })

      toast.success(`Welcome back, ${data.user.name}!`)
      return { success: true, message: data.message }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const register = async (name, email, password, phone) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "CLEAR_ERROR" })

      if (!name || !name.trim()) {
        toast.error("Please enter your full name")
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: false, error: "Name is required" }
      }

      if (!email || !email.trim()) {
        toast.error("Please enter your email address")
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: false, error: "Email is required" }
      }

      if (!password || !password.trim()) {
        toast.error("Please enter a password")
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: false, error: "Password is required" }
      }

      if (!phone || !phone.trim()) {
        toast.error("Please enter your phone number")
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: false, error: "Phone is required" }
      }

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phone }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          toast.error("An account with this email already exists. Please sign in instead.")
        } else {
          toast.error(data.message || "Registration failed. Please try again.")
        }
        throw new Error(data.message || "Registration failed")
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token: data.token,
          user: data.user,
        },
      })

      toast.success(`Welcome to ChipsStore, ${data.user.name}!`)
      return { success: true, message: data.message }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem("wishlist")
    localStorage.removeItem("cart")
    dispatch({ type: "LOGOUT" })
    toast.success("Logged out successfully!")
  }

  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "CLEAR_ERROR" })

      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed")
      }

      dispatch({ type: "UPDATE_USER", payload: data.user })
      dispatch({ type: "SET_LOADING", payload: false })

      return { success: true, message: data.message }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const toggleWishlist = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/wishlist/${productId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Wishlist update failed")
      }

      dispatch({ type: "UPDATE_USER", payload: { wishlist: data.wishlist } })
      toast.success(data.message)
      return { success: true, message: data.message }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" })
  }, [])

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateProfile,
    toggleWishlist,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
