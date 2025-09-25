"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { toast } from "react-toastify"

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.items.find((item) => item._id === action.payload._id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item._id === action.payload._id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload),
      }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item._id === action.payload.id ? { ...item, quantity: Math.max(0, action.payload.quantity) } : item,
          )
          .filter((item) => item.quantity > 0),
      }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      }

    case "LOAD_CART":
      return {
        ...state,
        items: action.payload,
      }

    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  const { isAuthenticated, user } = useAuth()

  const getCartKey = () => {
    return user?.id ? `chipsCart_${user.id}` : "chipsCart_guest"
  }

  useEffect(() => {
    if (user?.id) {
      const savedCart = localStorage.getItem(getCartKey())
      if (savedCart) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) })
      }
    }
  }, [user?.id])

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(getCartKey(), JSON.stringify(state.items))
    }
  }, [state.items, user?.id])

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear cart when user logs out
      dispatch({ type: "CLEAR_CART" })
      // Clear all user-specific cart data from localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("chipsCart_")) {
          localStorage.removeItem(key)
        }
      })
    }
  }, [isAuthenticated])

  const addToCart = (product) => {
    if (!isAuthenticated) {
      toast.info("Please sign in to add items to your cart", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      return false
    }
    dispatch({ type: "ADD_TO_CART", payload: product })
    return true
  }

  const removeFromCart = (productId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId })
  }

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
