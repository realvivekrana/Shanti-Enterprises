import { useState } from 'react';

const faqs = [
  {
    q: 'What is your return policy?',
    a: 'We offer a hassle-free return policy. If you are not satisfied with your purchase, you can return it within 30 days for a full refund or exchange. Return charges may apply.',
  },
  {
    q: 'How do I track my order?',
    a: 'Once your order is shipped, you will receive a confirmation email with a tracking number to track your order status.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Cash on Delivery and secure online payments through Razorpay (cards, UPI, netbanking).',
  },
  {
    q: 'Do you offer bulk/wholesale pricing?',
    a: 'Yes, we offer wholesale pricing for bulk orders. Contact us directly for custom quotes on large quantities.',
  },
];

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-3xl mx-auto divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex justify-between items-center px-5 py-4 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            {faq.q}
            <span className="text-slate-400 text-lg">{openIndex === i ? '−' : '+'}</span>
          </button>
          {openIndex === i && (
            <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">{faq.a}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;