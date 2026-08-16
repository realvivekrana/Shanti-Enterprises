import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 text-lg">Your cart is empty.</p>
        <Link to="/" className="text-teal-700 font-medium hover:underline mt-3 inline-block">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Your Cart</h1>

      <div className="space-y-3">
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-4">
            <img
              src={item.image || 'https://via.placeholder.com/80x80?text=No+Image'}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg bg-slate-50"
            />

            <div className="flex-grow">
              <h3 className="font-semibold text-slate-800">{item.name}</h3>
              <p className="text-slate-500 text-sm">₹{item.price}</p>
            </div>

            <div className="flex items-center border border-slate-300 rounded-lg">
              <button
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                className="px-3 py-1 text-slate-600 hover:bg-slate-100"
              >
                −
              </button>
              <span className="px-4 text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="px-3 py-1 text-slate-600 hover:bg-slate-100"
              >
                +
              </button>
            </div>

            <p className="font-semibold w-20 text-right text-slate-800">₹{item.price * item.quantity}</p>

            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8 border-t border-slate-200 pt-6">
        <p className="text-xl font-bold text-slate-800">Total: ₹{cartTotal}</p>
        <button
          onClick={() => navigate('/checkout')}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;