import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'react-feather';

export default function Footer() {
  const { isDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  const contactInfo = [
    { icon: Phone, text: '+1 (555) 123-4567' },
    { icon: Mail, text: 'contact@restaurant.com' },
    { icon: MapPin, text: '123 Food Street, Cuisine City' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${
        isDarkMode ? 'bg-dark-card text-dark-text' : 'bg-white text-gray-600'
      } shadow-lg transition-colors duration-300 mt-auto`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">Restaurant</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Bringing the finest dining experience to your doorstep since 2024.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-primary transition-colors duration-300"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-200">Contact Us</h3>
            <div className="space-y-3">
              {contactInfo.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center space-x-2 text-sm">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-gray-500 dark:text-gray-400">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-200">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {['About Us', 'Menu', 'Reservations', 'Contact', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <motion.a
                  key={link}
                  href="#"
                  whileHover={{ x: 5 }}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary 
                    dark:hover:text-primary transition-colors duration-300"
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} Restaurant App. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <motion.a
                href="#"
                whileHover={{ y: -2 }}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary 
                  dark:hover:text-primary transition-colors duration-300"
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -2 }}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary 
                  dark:hover:text-primary transition-colors duration-300"
              >
                Terms of Service
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}