import { useState } from 'react';
import API from '../api/axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent";

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Contact Us</h1>
      <p className="text-slate-500 mb-6">Have a question? Send us a message and we'll get back to you.</p>

      {success ? (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 text-center">
          <p className="text-teal-700 font-medium">Thank you! Your message has been sent.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <input type="text" name="name" placeholder="Your Name" required value={formData.name} onChange={handleChange} className={inputClass} />
          <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} className={inputClass} />
          <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className={inputClass} />
          <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} className={inputClass} />
          <textarea name="message" placeholder="Your Message" required rows={4} value={formData.message} onChange={handleChange} className={inputClass} />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:bg-slate-300">
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Contact;