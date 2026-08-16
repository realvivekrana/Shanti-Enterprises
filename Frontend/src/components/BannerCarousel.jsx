import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    title: 'Perfect Packing Bags',
    subtitle: 'Flipkart • Meesho • Amazon • Myntra',
    bg: 'from-amber-100 to-orange-100',
    text: 'text-slate-900',
  },
  {
    title: 'Durable Courier Boxes',
    subtitle: 'Built to protect every shipment',
    bg: 'from-teal-100 to-emerald-100',
    text: 'text-slate-900',
  },
  {
    title: 'Trusted by Sellers',
    subtitle: 'Fast delivery, wholesale pricing',
    bg: 'from-slate-800 to-slate-900',
    text: 'text-white',
  },
];

const BannerCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-72 sm:h-96 overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${slide.bg} transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="text-center px-4">
            <h1 className={`text-3xl sm:text-5xl font-extrabold ${slide.text}`}>{slide.title}</h1>
            <p className={`mt-3 font-medium ${slide.text} opacity-80`}>{slide.subtitle}</p>
            <Link
              to="#products"
              className="inline-block mt-6 bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === index ? 'bg-teal-600' : 'bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;