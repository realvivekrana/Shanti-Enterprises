// ============================================================
// SHANTI ENTERPRISES
// Order Success Page
// Frontend Phase 4 - Customer
// ============================================================

import {
  Link,
  useParams,
} from "react-router-dom";

function OrderSuccessPage() {
  const {
    orderId,
  } = useParams();

  return (
    <section className="app-page">

      <h1>
        Order Placed Successfully
      </h1>

      <p>
        Thank you for your order.
      </p>

      {orderId && (
        <p>
          Order ID:{" "}
          <strong>
            {orderId}
          </strong>
        </p>
      )}

      <p>
        Your order has been
        created successfully.
      </p>

      <div>

        <Link
          to={`/orders/${orderId}`}
        >
          Track Order
        </Link>

        {" "}

        <Link to="/orders">
          My Orders
        </Link>

        {" "}

        <Link to="/products">
          Continue Shopping
        </Link>

      </div>

    </section>
  );
}

export default OrderSuccessPage;