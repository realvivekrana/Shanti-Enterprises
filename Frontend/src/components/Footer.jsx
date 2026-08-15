const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-white font-semibold">Shanti Enterprises</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Reliable packaging supplies for e-commerce sellers — courier bags, boxes, tapes, and labels.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="/" className="hover:text-teal-400 transition-colors">Home</a></li>
            <li><a href="/cart" className="hover:text-teal-400 transition-colors">Cart</a></li>
            <li><a href="/login" className="hover:text-teal-400 transition-colors">Login</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Contact</h4>
          <ul className="space-y-2 text-sm text-slate-400">
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