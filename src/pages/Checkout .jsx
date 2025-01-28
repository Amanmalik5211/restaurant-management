import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { ArrowLeft, CreditCard, ShoppingBag, Lock } from 'react-feather';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const { items, subtotal, tax, shipping, total } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  if (!items || items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const order = {
        id: Date.now(),
        items,
        total,
        subtotal,
        tax,
        shipping,
        status: 'Processing',
        date: new Date().toISOString(),
        shippingDetails: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode
        }
      };

      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      orderHistory.push(order);
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

      dispatch(clearCart());

      toast.success('Order placed successfully! Redirecting to order history...', {
        duration: 3000,
        icon: '🎉',
        style: {
          background: isDarkMode ? '#333' : '#fff',
          color: isDarkMode ? '#fff' : '#333',
          border: `1px solid ${isDarkMode ? '#444' : '#eee'}`,
        },
      });

      setTimeout(() => {
        navigate('/order-history');
      }, 2000);
    } catch (error) {
      toast.error('Failed to place order. Please try again.', {
        icon: '❌',
        style: {
          background: isDarkMode ? '#333' : '#fff',
          color: isDarkMode ? '#fff' : '#333',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = `w-full px-4 py-3 rounded-lg border transition-all duration-200 
    ${isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-gray-200 focus:bg-gray-600' 
      : 'bg-white border-gray-300 focus:bg-gray-50'
    } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`;

  const labelClasses = `block mb-2 font-medium ${
    isDarkMode ? 'text-gray-300' : 'text-gray-700'
  }`;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} 
      transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/cart')}
          className={`group flex items-center gap-2 mb-8 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          } hover:text-primary transition-colors duration-300`}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back to Cart</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className={`${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-xl shadow-lg p-6 md:p-8 transition-all duration-300 
            hover:shadow-xl transform hover:-translate-y-1`}>
            <div className="flex items-center gap-3 mb-8">
              <Lock className={`w-6 h-6 ${isDarkMode ? 'text-primary' : 'text-primary-dark'}`} />
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Secure Checkout
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div className="space-y-6">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <ShoppingBag className="w-5 h-5" />
                  Shipping Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={labelClasses}>Full Name</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className={labelClasses}>Email</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className={labelClasses}>Address</label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className={inputClasses}
                    placeholder="1234 Main St"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className={labelClasses}>City</label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className={labelClasses}>ZIP Code</label>
                    <input
                      id="zipCode"
                      type="text"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-6">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </h3>

                <div>
                  <label htmlFor="cardNumber" className={labelClasses}>Card Number</label>
                  <input
                    id="cardNumber"
                    type="text"
                    name="cardNumber"
                    required
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className={inputClasses}
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="expiryDate" className={labelClasses}>Expiry Date</label>
                    <input
                      id="expiryDate"
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      required
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className={labelClasses}>CVV</label>
                    <input
                      id="cvv"
                      type="text"
                      name="cvv"
                      required
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-semibold text-white
                  transition-all duration-300 flex items-center justify-center gap-3
                  ${isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary-dark transform hover:-translate-y-1'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Place Order Securely
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className={`${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-xl shadow-lg p-6 md:p-8 h-fit lg:sticky lg:top-4 
            transition-all duration-300`}>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>
              <ShoppingBag className="w-5 h-5" />
              Order Summary
            </h3>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item.title}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    ${((item.pricePerServing * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className={`space-y-4 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            } pt-4`}>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  ${(subtotal / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Shipping</span>
                <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {shipping === 0 ? 'Free' : `$${(shipping / 100).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Tax (10%)</span>
                <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  ${(tax / 100).toFixed(2)}
                </span>
              </div>
              <div className={`border-t ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              } pt-4 mt-4`}>
                <div className="flex justify-between items-center">
                  <span className={`text-lg font-bold ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    Total
                  </span>
                  <span className="text-xl font-bold text-primary">
                    ${(total / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className={`mt-6 p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <Lock className="inline-block w-4 h-4 mr-2" />
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}