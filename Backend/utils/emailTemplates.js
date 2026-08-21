// ======================================================
// HTML ESCAPE
// ======================================================

const escapeHtml = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};


// ======================================================
// CURRENCY FORMAT
// ======================================================

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};


// ======================================================
// DATE FORMAT
// ======================================================

const formatDate = (value) => {
  const date = value ? new Date(value) : new Date();

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};


// ======================================================
// PAYMENT METHOD
// ======================================================

const formatPaymentMethod = (value) => {
  if (!value) {
    return 'Not specified';
  }

  const methods = {
    Razorpay: 'Online Payment',
    COD: 'Cash on Delivery',
    Credit: 'Credit Terms',
    Partial: 'Partial Payment',
  };

  return methods[value] || value;
};


// ======================================================
// STATUS COLOR
// ======================================================

const getStatusColor = (status) => {
  switch (status) {
    case 'Delivered':
      return '#16a34a';

    case 'Cancelled':
      return '#dc2626';

    case 'Shipped':
      return '#2563eb';

    case 'Processing':
      return '#d97706';

    case 'Packed':
      return '#7c3aed';

    default:
      return '#0d9488';
  }
};


// ======================================================
// ORDER CONFIRMATION EMAIL
// ======================================================

const orderConfirmationTemplate = (order, userName) => {
  const frontendUrl =
    process.env.FRONTEND_URL ||
    'http://localhost:5173';

  const orderId = order?._id
    ? String(order._id)
    : '';

  const customerName = escapeHtml(
    userName || 'Customer'
  );

  const orderDate = formatDate(
    order?.createdAt
  );

  const paymentMethod =
    formatPaymentMethod(
      order?.paymentMethod
    );

  const orderStatus =
    order?.orderStatus ||
    'Placed';

  const statusColor =
    getStatusColor(orderStatus);

  const orderLink =
    `${frontendUrl}/order-success/${orderId}`;


  // ====================================================
  // ORDER ITEMS
  // ====================================================

  const orderItems =
    Array.isArray(order?.orderItems)
      ? order.orderItems
      : [];


  const itemsHtml =
    orderItems.length > 0
      ? orderItems
          .map((item) => {
            const productName =
              escapeHtml(
                item?.name ||
                'Product'
              );

            const quantity =
              Number(
                item?.quantity || 0
              );

            const price =
              Number(
                item?.price || 0
              );

            const itemTotal =
              quantity * price;

            return `
              <tr>

                <td
                  style="
                    padding:15px 10px;
                    border-bottom:1px solid #e5e7eb;
                    color:#111827;
                    font-size:14px;
                  "
                >
                  <strong>
                    ${productName}
                  </strong>
                </td>

                <td
                  align="center"
                  style="
                    padding:15px 10px;
                    border-bottom:1px solid #e5e7eb;
                    color:#475569;
                    font-size:14px;
                  "
                >
                  ${quantity}
                </td>

                <td
                  align="right"
                  style="
                    padding:15px 10px;
                    border-bottom:1px solid #e5e7eb;
                    color:#475569;
                    font-size:14px;
                  "
                >
                  ${formatCurrency(price)}
                </td>

                <td
                  align="right"
                  style="
                    padding:15px 10px;
                    border-bottom:1px solid #e5e7eb;
                    color:#111827;
                    font-size:14px;
                    font-weight:600;
                  "
                >
                  ${formatCurrency(itemTotal)}
                </td>

              </tr>
            `;
          })
          .join('')
      : `
          <tr>

            <td
              colspan="4"
              align="center"
              style="
                padding:20px;
                color:#64748b;
              "
            >
              No order items found.
            </td>

          </tr>
        `;


  // ====================================================
  // SHIPPING ADDRESS
  // ====================================================

  const shippingAddress =
    order?.shippingAddress || {};

  const street =
    escapeHtml(
      shippingAddress.street
    );

  const city =
    escapeHtml(
      shippingAddress.city
    );

  const state =
    escapeHtml(
      shippingAddress.state
    );

  const pincode =
    escapeHtml(
      shippingAddress.pincode
    );

  const phone =
    escapeHtml(
      shippingAddress.phone
    );


  // ====================================================
  // PRICE SUMMARY
  // ====================================================

  const itemsPrice =
    Number(
      order?.itemsPrice || 0
    );

  const shippingPrice =
    Number(
      order?.shippingPrice || 0
    );

  const totalPrice =
    Number(
      order?.totalPrice || 0
    );


  // ====================================================
  // EMAIL HTML
  // ====================================================

  return `
<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    Order Confirmation - Shanti Enterprises
  </title>

</head>


<body
  style="
    margin:0;
    padding:0;
    background:#f1f5f9;
    font-family:Arial,Helvetica,sans-serif;
    color:#0f172a;
  "
>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    background:#f1f5f9;
    padding:30px 10px;
  "
>

<tr>

<td align="center">


<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    max-width:680px;
    background:#ffffff;
    border-radius:14px;
    overflow:hidden;
    border:1px solid #e2e8f0;
  "
>


<!-- ==================================================
     HEADER
=================================================== -->

<tr>

<td
  style="
    background:#0f766e;
    padding:25px 30px;
  "
>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
>

<tr>

<td>

<div
  style="
    color:#ffffff;
    font-size:24px;
    font-weight:700;
  "
>
  Shanti Enterprises
</div>

<div
  style="
    color:#ccfbf1;
    font-size:13px;
    margin-top:5px;
  "
>
  Wholesale Packaging Solutions
</div>

</td>


<td align="right">

<div
  style="
    width:42px;
    height:42px;
    border-radius:50%;
    background:#ffffff;
    color:#0f766e;
    font-size:23px;
    font-weight:700;
    line-height:42px;
    text-align:center;
  "
>
  ✓
</div>

</td>

</tr>

</table>

</td>

</tr>


<!-- ==================================================
     MAIN MESSAGE
=================================================== -->

<tr>

<td
  style="
    padding:32px 30px 20px;
  "
>

<div
  style="
    font-size:24px;
    font-weight:700;
    color:#0f172a;
    margin-bottom:10px;
  "
>
  Your order has been confirmed!
</div>


<div
  style="
    color:#475569;
    font-size:15px;
    line-height:24px;
  "
>
  Hi ${customerName},
  <br /><br />

  Thank you for shopping with
  Shanti Enterprises.

  We have received your order and
  it is now being processed.
</div>

</td>

</tr>


<!-- ==================================================
     ORDER SUMMARY
=================================================== -->

<tr>

<td
  style="
    padding:10px 30px 20px;
  "
>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="
    background:#f8fafc;
    border:1px solid #e2e8f0;
    border-radius:10px;
  "
>

<tr>


<td
  style="
    padding:16px;
  "
>

<div
  style="
    color:#64748b;
    font-size:11px;
    text-transform:uppercase;
  "
>
  Order ID
</div>

<div
  style="
    margin-top:6px;
    color:#0f172a;
    font-size:13px;
    font-weight:700;
    word-break:break-all;
  "
>
  ${escapeHtml(orderId)}
</div>

</td>


<td
  style="
    padding:16px;
  "
>

<div
  style="
    color:#64748b;
    font-size:11px;
    text-transform:uppercase;
  "
>
  Order Date
</div>

<div
  style="
    margin-top:6px;
    color:#0f172a;
    font-size:13px;
    font-weight:600;
  "
>
  ${orderDate}
</div>

</td>


<td
  style="
    padding:16px;
  "
>

<div
  style="
    color:#64748b;
    font-size:11px;
    text-transform:uppercase;
  "
>
  Status
</div>

<div
  style="
    margin-top:6px;
    color:${statusColor};
    font-size:13px;
    font-weight:700;
  "
>
  ${escapeHtml(orderStatus)}
</div>

</td>


</tr>

</table>

</td>

</tr>


<!-- ==================================================
     PRODUCTS
=================================================== -->

<tr>

<td
  style="
    padding:0 30px;
  "
>

<div
  style="
    color:#0f172a;
    font-size:17px;
    font-weight:700;
    margin-bottom:12px;
  "
>
  Order Details
</div>


<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    border:1px solid #e2e8f0;
    border-radius:10px;
    overflow:hidden;
  "
>

<thead>

<tr
  style="
    background:#f8fafc;
  "
>

<th
  align="left"
  style="
    padding:12px 10px;
    color:#475569;
    font-size:11px;
    text-transform:uppercase;
  "
>
  Product
</th>

<th
  align="center"
  style="
    padding:12px 10px;
    color:#475569;
    font-size:11px;
    text-transform:uppercase;
  "
>
  Qty
</th>

<th
  align="right"
  style="
    padding:12px 10px;
    color:#475569;
    font-size:11px;
    text-transform:uppercase;
  "
>
  Price
</th>

<th
  align="right"
  style="
    padding:12px 10px;
    color:#475569;
    font-size:11px;
    text-transform:uppercase;
  "
>
  Total
</th>

</tr>

</thead>


<tbody>

${itemsHtml}

</tbody>

</table>

</td>

</tr>


<!-- ==================================================
     TOTAL
=================================================== -->

<tr>

<td
  style="
    padding:20px 30px 0;
  "
>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
>

<tr>

<td
  align="right"
  style="
    padding:5px 0;
    color:#64748b;
    font-size:14px;
  "
>
  Items Total
</td>

<td
  align="right"
  width="130"
  style="
    padding:5px 0;
    color:#0f172a;
    font-size:14px;
    font-weight:600;
  "
>
  ${formatCurrency(itemsPrice)}
</td>

</tr>


<tr>

<td
  align="right"
  style="
    padding:5px 0;
    color:#64748b;
    font-size:14px;
  "
>
  Shipping
</td>

<td
  align="right"
  style="
    padding:5px 0;
    color:#0f172a;
    font-size:14px;
    font-weight:600;
  "
>
  ${formatCurrency(shippingPrice)}
</td>

</tr>


<tr>

<td
  align="right"
  style="
    padding:14px 0 5px;
    border-top:1px solid #e2e8f0;
    color:#0f172a;
    font-size:17px;
    font-weight:700;
  "
>
  Grand Total
</td>

<td
  align="right"
  style="
    padding:14px 0 5px;
    border-top:1px solid #e2e8f0;
    color:#0f766e;
    font-size:20px;
    font-weight:700;
  "
>
  ${formatCurrency(totalPrice)}
</td>

</tr>

</table>

</td>

</tr>


<!-- ==================================================
     PAYMENT
=================================================== -->

<tr>

<td
  style="
    padding:25px 30px 0;
  "
>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
>

<tr>

<td
  width="48%"
  style="
    background:#f8fafc;
    border:1px solid #e2e8f0;
    border-radius:10px;
    padding:16px;
  "
>

<div
  style="
    color:#64748b;
    font-size:11px;
    text-transform:uppercase;
  "
>
  Payment Method
</div>

<div
  style="
    margin-top:7px;
    color:#0f172a;
    font-size:14px;
    font-weight:700;
  "
>
  ${escapeHtml(paymentMethod)}
</div>

</td>


<td width="4%">
</td>


<td
  width="48%"
  style="
    background:#f8fafc;
    border:1px solid #e2e8f0;
    border-radius:10px;
    padding:16px;
  "
>

<div
  style="
    color:#64748b;
    font-size:11px;
    text-transform:uppercase;
  "
>
  Contact Number
</div>

<div
  style="
    margin-top:7px;
    color:#0f172a;
    font-size:14px;
    font-weight:700;
  "
>
  ${phone || 'Not provided'}
</div>

</td>

</tr>

</table>

</td>

</tr>


<!-- ==================================================
     ADDRESS
=================================================== -->

<tr>

<td
  style="
    padding:25px 30px 0;
  "
>

<div
  style="
    color:#0f172a;
    font-size:17px;
    font-weight:700;
    margin-bottom:12px;
  "
>
  Delivery Address
</div>


<div
  style="
    background:#f8fafc;
    border:1px solid #e2e8f0;
    border-radius:10px;
    padding:16px;
    color:#475569;
    font-size:14px;
    line-height:23px;
  "
>

${street || 'Address not provided'}

<br />

${city}

${city && state ? ', ' : ''}

${state}

${pincode ? ` - ${pincode}` : ''}

<br />

${phone ? `Phone: ${phone}` : ''}

</div>

</td>

</tr>


<!-- ==================================================
     BUTTON
=================================================== -->

<tr>

<td
  align="center"
  style="
    padding:30px;
  "
>

<a
  href="${escapeHtml(orderLink)}"
  style="
    display:inline-block;
    background:#0f766e;
    color:#ffffff;
    text-decoration:none;
    font-size:15px;
    font-weight:700;
    padding:13px 26px;
    border-radius:8px;
  "
>
  View Your Order
</a>

</td>

</tr>


<!-- ==================================================
     FOOTER MESSAGE
=================================================== -->

<tr>

<td
  style="
    padding:0 30px 30px;
  "
>

<div
  style="
    border-top:1px solid #e2e8f0;
    padding-top:20px;
    color:#64748b;
    font-size:13px;
    line-height:21px;
    text-align:center;
  "
>

Need help with your order?

<br />

Please contact Shanti Enterprises
and keep your Order ID ready.

</div>

</td>

</tr>


<!-- ==================================================
     FOOTER
=================================================== -->

<tr>

<td
  align="center"
  style="
    background:#f8fafc;
    border-top:1px solid #e2e8f0;
    padding:22px 30px;
  "
>

<div
  style="
    color:#0f172a;
    font-size:14px;
    font-weight:700;
  "
>
  Shanti Enterprises
</div>

<div
  style="
    color:#64748b;
    font-size:12px;
    margin-top:5px;
    line-height:19px;
  "
>
  Wholesale Packaging Solutions
  <br />
  Thank you for choosing us.
</div>

</td>

</tr>


</table>

</td>

</tr>

</table>

</body>

</html>
`;
};


// ======================================================
// CONTACT ACKNOWLEDGEMENT EMAIL
// ======================================================

const contactAcknowledgementTemplate = (name) => {
  const customerName = escapeHtml(
    name || 'Customer'
  );

  return `
<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    Message Received - Shanti Enterprises
  </title>

</head>


<body
  style="
    margin:0;
    padding:0;
    background:#f1f5f9;
    font-family:Arial,Helvetica,sans-serif;
  "
>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="
    padding:30px 10px;
  "
>

<tr>

<td align="center">


<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="
    max-width:600px;
    background:#ffffff;
    border:1px solid #e2e8f0;
    border-radius:14px;
    overflow:hidden;
  "
>


<tr>

<td
  style="
    background:#0f766e;
    color:#ffffff;
    padding:25px;
  "
>

<div
  style="
    font-size:22px;
    font-weight:700;
  "
>
  Shanti Enterprises
</div>

<div
  style="
    font-size:13px;
    color:#ccfbf1;
    margin-top:5px;
  "
>
  Wholesale Packaging Solutions
</div>

</td>

</tr>


<tr>

<td
  style="
    padding:30px;
  "
>

<h2
  style="
    margin:0 0 12px;
    color:#0f172a;
  "
>
  We received your message
</h2>


<p
  style="
    color:#475569;
    line-height:24px;
  "
>
  Hi ${customerName},
</p>


<p
  style="
    color:#475569;
    line-height:24px;
  "
>
  Thanks for reaching out to
  Shanti Enterprises.

  Our team will get back to you
  shortly.
</p>

</td>

</tr>


<tr>

<td
  align="center"
  style="
    background:#f8fafc;
    border-top:1px solid #e2e8f0;
    padding:20px;
    color:#64748b;
    font-size:12px;
  "
>
  Shanti Enterprises —
  Wholesale Packaging Solutions
</td>

</tr>


</table>

</td>

</tr>

</table>

</body>

</html>
`;
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  orderConfirmationTemplate,
  contactAcknowledgementTemplate,
};
