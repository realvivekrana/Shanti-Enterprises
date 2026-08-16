import { useParams } from 'react-router-dom';

const policies = {
  'terms-of-service': {
    title: 'Terms & Conditions',
    content: 'By using this website, you agree to our terms of service. All orders are subject to availability and confirmation. Prices are subject to change without notice.',
  },
  'shipping-policy': {
    title: 'Shipping Policy',
    content: 'We ship across India via trusted courier partners. Delivery typically takes 3-7 business days depending on your location. Shipping charges apply as shown at checkout.',
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    content: 'We respect your privacy. Your personal information is used only to process orders and improve your shopping experience, and is never shared with third parties without consent.',
  },
  'refund-policy': {
    title: 'Refund & Return Policy',
    content: 'We offer a hassle-free return policy within 30 days of delivery for a full refund or exchange. Return shipping charges may apply.',
  },
};

const PolicyPage = () => {
  const { type } = useParams();
  const policy = policies[type];

  if (!policy) return <p className="p-8 text-slate-500">Page not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">{policy.title}</h1>
      <p className="text-slate-600 leading-relaxed">{policy.content}</p>
    </div>
  );
};

export default PolicyPage;