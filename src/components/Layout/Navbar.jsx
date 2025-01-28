import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  ShoppingCart, 
  Menu as MenuIcon, 
  X, 
  User, 
  LogIn, 
  ShoppingBag, 
  LogOut,
  Settings
} from 'react-feather';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { items = [] } = useSelector((state) => state.cart) || { items: [] };
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { isDarkMode } = useTheme();
  
  // Safely calculate cart totals with default values
  const cartItemsCount = items?.reduce((total, item) => total + (item?.quantity || 0), 0) || 0;
  const cartTotal = items?.reduce((total, item) => 
    total + ((item?.pricePerServing || 0) * (item?.quantity || 0)), 0) || 0;


  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0, 
      y: 10, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`sticky top-0 z-50 ${
        isDarkMode ? 'bg-dark-card' : 'bg-white'
      } shadow-lg backdrop-blur-md bg-opacity-90 transition-all duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-primary dark:text-primary hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8" />
              <span>Restaurant</span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full text-gray-700 dark:text-gray-300 
              hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/menu" 
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 
                hover:text-primary dark:hover:text-primary transition-colors duration-300"
            >
              <span>Menu</span>
            </Link>
            
            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 
                      hover:text-primary dark:hover:text-primary transition-colors duration-300"
                  >
                    <User className="h-5 w-5" />
                    <span>{user?.name || 'User'}</span>
                  </motion.button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-lg 
                          shadow-lg py-1 border dark:border-gray-700"
                      >
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 
                            dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 
                            dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={() => {
                            // Handle logout
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 
                            dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Cart Dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative"
                  >
                    <ShoppingCart className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    {cartItemsCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-primary text-white text-xs 
                          font-bold rounded-full h-5 w-5 flex items-center justify-center"
                      >
                        {cartItemsCount}
                      </motion.span>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {isCartOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-card 
                          rounded-lg shadow-xl border dark:border-gray-700"
                      >
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            Shopping Cart
                          </h3>
                          {items.length === 0 ? (
                            <div className="text-center py-6">
                              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                              <p className="text-gray-500 dark:text-gray-400">
                                Your cart is empty
                              </p>
                            </div>
                          ) : (
                            <>
                              <div className="max-h-64 overflow-y-auto">
                                {items.map((item) => (
                                  <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-3 py-3 border-b 
                                      dark:border-gray-700 last:border-b-0"
                                  >
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                      <h4 className="text-sm font-medium dark:text-gray-200">
                                        {item.title}
                                      </h4>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {item.quantity} × ${((item.price || 0) / 100).toFixed(2)}
                                      </p>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                              <div className="mt-4 pt-3 border-t dark:border-gray-700">
                                <div className="flex justify-between mb-4">
                                  <span className="font-semibold dark:text-gray-200">Total:</span>
                                  <span className="font-semibold text-primary">
                                    ${(cartTotal / 100).toFixed(2)}
                                  </span>
                                </div>
                                <Link
                                  to="/cart"
                                  onClick={() => setIsCartOpen(false)}
                                  className="block w-full bg-primary text-white text-center py-2 
                                    rounded-lg hover:bg-primary-dark transition-colors duration-300"
                                >
                                  View Cart
                                </Link>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-2 text-white bg-primary px-4 py-2 
                  rounded-lg hover:bg-primary-dark transition-colors duration-300"
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 space-y-4"
            >
              <Link 
                to="/menu" 
                className="block text-gray-700 dark:text-gray-300 hover:text-primary 
                  dark:hover:text-primary transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile" 
                    className="block text-gray-700 dark:text-gray-300 hover:text-primary 
                      dark:hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/cart" 
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 
                      hover:text-primary dark:hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart ({cartItemsCount})</span>
                  </Link>
                  <button
                    onClick={() => {
                      // Handle logout
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-red-600 dark:text-red-400 
                      hover:text-red-700 dark:hover:text-red-300 w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="block text-primary hover:text-primary-dark"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
              
              <div className="pt-2">
                <ThemeToggle />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}



