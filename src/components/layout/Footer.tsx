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
    <footer className="bg-[var(--neutral-900)] text-white">
      {/* Features */}
      <div className="border-b border-[var(--neutral-700)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="p-2 bg-[var(--brand-500)]/20 rounded-lg">
                  <feature.icon className="w-5 h-5 text-[var(--brand-400)]" />
                </div>
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-[var(--neutral-400)]">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="text-2xl font-display font-bold text-[var(--brand-500)]">
              LuxeMarket
            </Link>
            <p className="mt-4 text-sm text-[var(--neutral-400)]">
              Premium e-commerce experience with curated products for discerning customers.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 bg-[var(--neutral-800)] rounded-lg hover:bg-[var(--brand-500)] transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-[var(--neutral-400)] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-[var(--neutral-400)] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-[var(--neutral-400)] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-[var(--neutral-400)]">
                <Mail className="w-4 h-4" />
                <span>support@luxemarket.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--neutral-400)]">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[var(--neutral-400)]">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>123 Commerce St, NYC</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[var(--neutral-700)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--neutral-400)]">
              &copy; {new Date().getFullYear()} LuxeMarket. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-[var(--neutral-400)]">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
