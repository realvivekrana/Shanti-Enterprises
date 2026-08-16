import { useState, useEffect } from 'react';

const DiscountPopup = () => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('discountPopupShown');
    if (!alreadyShown) {
      const timer = setTimeout(() => {
        setShow(true);
        sessionStorage.setItem('discountPopupShown', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Abhi ke liye sirf localStorage mein save karte hain — chahें to baad mein backend API bana ke yahan bhej sakte hain
    setSubmitted(true);
    setTimeout(() => setShow(false), 1800);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-8 relative">
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl"
        >
          &times;
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="font-semibold text-slate-800">Shanti Enterprises</span>
        </div>

        {submitted ? (
          <p className="text-slate-700 font-medium py-6 text-center">
            Thanks! Use code <span className="font-bold text-teal-700">PACK10</span> at checkout.
          </p>
        ) : (
          <>
            <h2 className="text-xl font-bold text-slate-800">Get 10% OFF your first order</h2>
            <p className="text-sm text-slate-500 mt-1">Sign up and unlock your instant discount.</p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              <button
                type="submit"
                className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium"
              >
                Claim Discount
              </button>
            </form>

            <button
              onClick={() => setShow(false)}
              className="text-sm text-slate-500 hover:text-slate-700 mt-3 block mx-auto"
            >
              No, thanks
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DiscountPopup;