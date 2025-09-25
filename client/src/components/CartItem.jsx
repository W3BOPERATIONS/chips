"use client"
import { useCart } from "../context/CartContext"

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart()

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(item._id)
    } else {
      updateQuantity(item._id, newQuantity)
    }
  }

  const handleRemove = () => {
    removeFromCart(item._id)
  }

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={item.imageURL || "/placeholder.svg"}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
          <p className="text-lg font-bold text-primary-600">₹{item.price.toFixed(2)}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-2 hover:bg-gray-100 transition-colors"
              disabled={item.quantity <= 1}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>

            <input
              type="number"
              min="1"
              max="99"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
              className="w-16 text-center py-2 border-0 focus:outline-none"
            />

            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove item"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        {/* Item Total */}
        <div className="text-right">
          <p className="text-lg font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
          <p className="text-sm text-gray-500">
            {item.quantity} × ₹{item.price.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CartItem
