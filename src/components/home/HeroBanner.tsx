import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    title: 'Summer Collection 2024',
    subtitle: 'Up to 50% off on selected items',
    cta: 'Shop Now',
    link: '/products',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200',
    title: 'Premium Electronics',
    subtitle: 'Latest gadgets at unbeatable prices',
    cta: 'Explore',
    link: '/category/electronics',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200',
    title: 'Home & Living',
    subtitle: 'Transform your space with our curated collection',
    cta: 'Discover',
    link: '/category/home',
  },
];

export const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <section
      className="relative h-[480px] md:h-[480px] rounded-2xl overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-lg mb-12 ml-8"
            >
              <p className="text-[13px] text-white/70 uppercase tracking-widest font-medium mb-3">
                New Collection
              </p>
              <h1 className="text-[44px] font-display font-bold text-white leading-[1.1]">
                {slides[currentSlide].title}
              </h1>
              <p className="text-[15px] text-white/80 mt-2 leading-relaxed">
                {slides[currentSlide].subtitle}
              </p>
              <motion.div
                className="mt-6"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={slides[currentSlide].link}
                  className="inline-flex items-center gap-2 h-10 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[14px] font-semibold transition-colors"
                >
                  {slides[currentSlide].cta}
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/20 backdrop-blur rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/20 backdrop-blur rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-6'
                : 'bg-white/40 w-2 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
