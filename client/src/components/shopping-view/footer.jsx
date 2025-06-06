import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Heart,
  Star,
  Award,
  Shield,
  Truck
} from "lucide-react";

function ShoppingFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: "About Us", path: "/shop/about" },
      { label: "Contact", path: "/shop/contact" },
      { label: "Careers", path: "/shop/careers" },
      { label: "Press", path: "/shop/press" }
    ],
    support: [
      { label: "Help Center", path: "/shop/help" },
      { label: "Shipping Info", path: "/shop/shipping" },
      { label: "Returns", path: "/shop/returns" },
      { label: "Size Guide", path: "/shop/size-guide" }
    ],
    legal: [
      { label: "Privacy Policy", path: "/shop/privacy" },
      { label: "Terms of Service", path: "/shop/terms" },
      { label: "Cookie Policy", path: "/shop/cookies" }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-400" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-400" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-400" }
  ];

  const features = [
    { icon: Shield, text: "Secure Payment", color: "text-green-400" },
    { icon: Truck, text: "Fast Delivery", color: "text-blue-400" },
    { icon: Award, text: "Quality Products", color: "text-yellow-400" },
    { icon: Heart, text: "Customer Love", color: "text-red-400" }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-1"></div>
      </div>
      
      {/* Trust Indicators */}
      <div className="border-b border-gray-700/50">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <div className={`p-2 rounded-full bg-gray-800 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/logoLight.png"
                alt="BookSale"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted bookstore destination. We bring you quality books, expert recommendations,
              and exceptional service to book lovers across the Philippines.
            </p>
            
            {/* Contact Info with Icons */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-300 hover:text-blue-400 transition-colors group">
                <div className="p-1.5 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span>info@booksale.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300 hover:text-green-400 transition-colors group">
                <div className="p-1.5 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+63 (2) 8123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300 hover:text-red-400 transition-colors group">
                <div className="p-1.5 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>456 Book Avenue, Manila, Philippines</span>
              </div>
            </div>

            {/* Rating Section */}
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-300">4.8/5 from 2,000+ reviews</span>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white relative">
              Company
              <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></div>
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-blue-400 transition-all duration-300 text-sm hover:translate-x-1 inline-block relative group"
                  >
                    <span className="relative z-10">{link.label}</span>
                    <div className="absolute inset-0 bg-blue-500/10 rounded scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white relative">
              Support
              <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-green-400 to-blue-400"></div>
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-green-400 transition-all duration-300 text-sm hover:translate-x-1 inline-block relative group"
                  >
                    <span className="relative z-10">{link.label}</span>
                    <div className="absolute inset-0 bg-green-500/10 rounded scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-white relative mb-4">
                Legal
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"></div>
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-purple-400 transition-all duration-300 text-sm hover:translate-x-1 inline-block relative group"
                    >
                      <span className="relative z-10">{link.label}</span>
                      <div className="absolute inset-0 bg-purple-500/10 rounded scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Social Media Links */}
            <div>
              <h4 className="font-bold text-white mb-4">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className={`p-3 bg-gray-800 rounded-lg text-gray-300 ${social.color} transition-all duration-300 hover:scale-110 hover:bg-gray-700 group`}
                  >
                    <social.icon className="h-5 w-5 group-hover:animate-pulse" />
                  </a>
                ))}
              </div>
              
              {/* Social Stats */}
              <div className="mt-4 text-xs text-gray-400">
                <p>Join 50,000+ followers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-gray-600 to-transparent" />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright with Heart */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>© {currentYear} BookSale. Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-red-400 animate-pulse" />
            <span>for book lovers</span>
          </div>
          
          {/* Quick Links with Hover Effects */}
          <div className="flex gap-6">
            <Link
              to="/shop/privacy"
              className="text-gray-400 hover:text-blue-400 text-sm transition-all duration-300 hover:scale-105 relative group"
            >
              Privacy
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link
              to="/shop/terms"
              className="text-gray-400 hover:text-green-400 text-sm transition-all duration-300 hover:scale-105 relative group"
            >
              Terms
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link
              to="/shop/cookies"
              className="text-gray-400 hover:text-purple-400 text-sm transition-all duration-300 hover:scale-105 relative group"
            >
              Cookies
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></div>
            </Link>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
      </div>
    </footer>
  );
}

export default ShoppingFooter;