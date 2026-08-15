import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
        <Link to="/" className="text-gray-900 underline mt-2 inline-block">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center gap-4 border rounded-lg p-4">
            <img
              src={item.image || 'https://via.placeholder.com/80x80?text=No+Image'}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />

            <div className="flex-grow">
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-gray-600">₹{item.price}</p>
            </div>

            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                −
              </button>
              <span className="px-4">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <p className="font-semibold w-20 text-right">₹{item.price * item.quantity}</p>

            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8 border-t pt-6">
        <p className="text-xl font-bold">Total: ₹{cartTotal}</p>
        <button
          onClick={() => navigate('/checkout')}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;