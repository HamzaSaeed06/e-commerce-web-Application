import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, CreditCard, Truck, Shield, RotateCcw } from 'lucide-react';

export const Footer = () => {
  const footerLinks = {
    shop: [
      { to: '/products', label: 'All Products' },
      { to: '/category/electronics', label: 'Electronics' },
      { to: '/category/fashion', label: 'Fashion' },
      { to: '/category/home', label: 'Home & Living' },
      { to: '/category/beauty', label: 'Beauty' },
    ],
    support: [
      { to: '/contact', label: 'Contact Us' },
      { to: '/faq', label: 'FAQs' },
      { to: '/shipping', label: 'Shipping Info' },
      { to: '/returns', label: 'Returns' },
      { to: '/track-order', label: 'Track Order' },
    ],
    company: [
      { to: '/about', label: 'About Us' },
      { to: '/careers', label: 'Careers' },
      { to: '/press', label: 'Press' },
      { to: '/blog', label: 'Blog' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
    { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
    { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: CreditCard, title: 'Flexible Payment', desc: 'Multiple options' },
  ];

  return (
    <footer className="bg-black text-white">
      {/* Features - Monochrome Minimalist */}
      <div className="border-b border-(--neutral-800)">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col gap-4 text-center md:text-left">
                <div className="flex justify-center md:justify-start">
                  <feature.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-bold text-[13px] uppercase tracking-widest leading-none mb-1">{feature.title}</p>
                  <p className="text-[12px] text-(--neutral-400) font-medium">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-6">
            <Link to="/" className="flex flex-col items-start leading-none group">
              <span className="text-xl font-bold text-white uppercase tracking-[0.2em]">
                ZEST
              </span>
              <span className="text-[11px] font-medium text-(--neutral-400) uppercase tracking-[0.3em] mt-1 group-hover:text-white transition-colors">
                & PARTNERS
              </span>
            </Link>
            <p className="text-[13px] text-(--neutral-400) leading-relaxed">
              Experience editorial excellence in every product. Curated for the modern lifestyle.
            </p>
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-(--neutral-400) hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-widest mb-6">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[13px] text-(--neutral-400) hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-widest mb-6">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[13px] text-(--neutral-400) hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[13px] text-(--neutral-400) hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-[13px] text-(--neutral-400)">
                <Mail className="w-4 h-4" />
                <span>concierge@zestpartners.com</span>
              </li>
              <li className="flex items-center gap-3 text-[13px] text-(--neutral-400)">
                <Phone className="w-4 h-4" />
                <span>+1 800 ZEST PARTNERS</span>
              </li>
              <li className="flex items-start gap-3 text-[13px] text-(--neutral-400)">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Flagship: 123 Regent St, London</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-(--neutral-800)">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[11px] font-bold text-(--neutral-500) uppercase tracking-widest">
              &copy; {new Date().getFullYear()} ZEST & PARTNERS. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-8 text-[11px] font-bold text-(--neutral-500) uppercase tracking-widest">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
