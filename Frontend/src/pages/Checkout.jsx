import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userInfo = localStorage.getItem('userInfo');
  const isLoggedIn = !!userInfo;
  const user = userInfo ? JSON.parse(userInfo) : null;

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const shippingPrice = 50;
  const totalPrice = cartTotal + shippingPrice;

  const createOrderInDB = async (paymentResult = null) => {
    const orderItems = cartItems.map((item) => ({
      product: item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const { data } = await API.post('/orders', {
      orderItems,
      shippingAddress: address,
      paymentMethod,
      itemsPrice: cartTotal,
      shippingPrice,
      totalPrice,
    });

    if (paymentResult) {
      await API.put(`/orders/${data._id}/pay`, paymentResult);
    }

    clearCart();
    navigate(`/order-success/${data._id}`);
  };

  const handleRazorpayPayment = async () => {
    try {
      const { data: razorpayOrder } = await API.post('/payment/create-order', {
        amount: totalPrice,
      });

      const options = {
        key: 'rzp_test_TQ87uv6EO8OzPI',
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'Shanti Enterprises',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            const { data: verifyData } = await API.post('/payment/verify', response);

            if (verifyData.success) {
              await createOrderInDB({
                id: response.razorpay_payment_id,
                status: 'success',
                updateTime: new Date().toISOString(),
              });
            } else {
              setError('Payment verification failed');
            }
          } catch (err) {
            setError('Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: address.phone,
        },
        theme: { color: '#111827' },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      setError('Failed to initiate payment');
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLoggedIn) {
      setError('Please login to place an order.');
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'Razorpay') {
        await handleRazorpayPayment();
      } else {
        await createOrderInDB();
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <h2 className="font-semibold text-gray-800">Shipping Address</h2>

          <input
            type="text"
            name="street"
            placeholder="Street Address"
            required
            value={address.street}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              required
              value={address.city}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              required
              value={address.state}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              required
              value={address.pincode}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              required
              value={address.phone}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
          </div>

          <h2 className="font-semibold text-gray-800 pt-4">Payment Method</h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="Razorpay"
                checked={paymentMethod === 'Razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Online Payment
            </label>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>

        <div className="border rounded-lg p-6 h-fit">
          <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between text-sm py-1">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t mt-3 pt-3 flex justify-between text-sm">
            <span>Shipping</span>
            <span>₹{shippingPrice}</span>
          </div>
          <div className="border-t mt-3 pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;