import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <span className="text-white font-semibold">Shanti Enterprises</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Reliable packaging supplies for e-commerce sellers — courier bags, boxes, tapes, and labels.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Category</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
            <li><Link to="/?category=Courier Bags" className="hover:text-teal-400 transition-colors">Courier Bag</Link></li>
            <li><Link to="/?category=Boxes,Tapes" className="hover:text-teal-400 transition-colors">Boxes & Tapes</Link></li>
            <li><Link to="/?category=Labels" className="hover:text-teal-400 transition-colors">Labels & Stickers</Link></li>
            <li><Link to="/?category=Paper Shredded" className="hover:text-teal-400 transition-colors">Paper Shredded</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Policies</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/policies/terms-of-service" className="hover:text-teal-400 transition-colors">Terms & Condition</Link></li>
            <li><Link to="/policies/shipping-policy" className="hover:text-teal-400 transition-colors">Shipping Policy</Link></li>
            <li><Link to="/policies/privacy-policy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/policies/refund-policy" className="hover:text-teal-400 transition-colors">Refund and Return</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Follow Us</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Store - Shanti Enterprises</li>
            <li>Pune, Maharashtra</li>
            <li>support@shantienterprises.in</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Shanti Enterprises. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;