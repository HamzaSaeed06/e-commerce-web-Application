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
      className="relative h-[560px] md:h-[640px] overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-xl"
            >
              <p className="text-[12px] text-white/80 uppercase tracking-[0.3em] font-bold mb-4">
                Exclusive Partnership
              </p>
              <h1 className="text-[48px] md:text-[64px] font-bold text-white leading-[1.05] tracking-tight">
                {slides[currentSlide].title.toUpperCase()}
              </h1>
              <p className="text-[16px] text-white/70 mt-4 leading-relaxed max-w-md font-medium">
                {slides[currentSlide].subtitle}
              </p>
              <motion.div
                className="mt-8"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={slides[currentSlide].link}
                  className="inline-flex items-center justify-center h-14 px-10 bg-white text-black text-[13px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all border border-white"
                >
                  {slides[currentSlide].cta}
                  <ArrowRight size={18} className="ml-3" />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows - Sharp & Minimalist */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center border border-white/30 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black"
      >
        <ChevronLeft size={24} strokeWidth={1.5} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center border border-white/30 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black"
      >
        <ChevronRight size={24} strokeWidth={1.5} />
      </button>

      {/* Progress Indicators - Sharp Lines */}
      <div className="absolute bottom-10 left-6 sm:left-12 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-[3px] transition-all duration-500 ${
              index === currentSlide
                ? 'bg-white w-20'
                : 'bg-white/30 w-8 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
