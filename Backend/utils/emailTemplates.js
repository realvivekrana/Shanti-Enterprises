const orderConfirmationTemplate = (order, userName) => `
  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
    <h2 style="color: #0d9488;">Order Confirmed!</h2>
    <p>Hi ${userName},</p>
    <p>Thank you for your order. Here are your order details:</p>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Total Amount:</strong> ₹${order.totalPrice}</p>
    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
    <hr />
    <p style="color: #64748b; font-size: 13px;">Shanti Enterprises — Packaging supplies for your e-commerce business.</p>
  </div>
`;

const contactAcknowledgementTemplate = (name) => `
  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
    <h2 style="color: #0d9488;">We received your message</h2>
    <p>Hi ${name},</p>
    <p>Thanks for reaching out to Shanti Enterprises. Our team will get back to you shortly.</p>
    <hr />
    <p style="color: #64748b; font-size: 13px;">Shanti Enterprises — Packaging supplies for your e-commerce business.</p>
  </div>
`;

module.exports = { orderConfirmationTemplate, contactAcknowledgementTemplate };