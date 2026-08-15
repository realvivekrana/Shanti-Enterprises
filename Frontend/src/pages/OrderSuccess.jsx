import { Link, useParams } from 'react-router-dom';

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-green-600">Order Placed Successfully!</h1>
      <p className="text-gray-600 mt-2">Your order ID: <span className="font-mono">{id}</span></p>
      <Link to="/" className="inline-block mt-6 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;