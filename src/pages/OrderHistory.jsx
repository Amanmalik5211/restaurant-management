import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {Clock, ArrowLeft, ShoppingBag } from 'react-feather';

export default function OrderHistory() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    setOrders(orderHistory.reverse()); // Show newest orders first
  }, []);

  if (!orders.length) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-16">
            <ShoppingBag className={`w-20 h-20 mx-auto mb-6 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h2 className={`text-3xl font-bold mb-4 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>
              No Orders Yet
            </h2>
            <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Start exploring our delicious menu and place your first order!
            </p>
            <button
              onClick={() => navigate('/menu')}
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 
                rounded-lg hover:bg-primary-dark transition-all duration-300 
                transform hover:-translate-y-1"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="container mx-auto px-4">
        <Link
          to="/menu"
          className={`inline-flex items-center gap-2 mb-8 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          } hover:text-primary transition-colors duration-300`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Menu
        </Link>

        <h1 className={`text-2xl font-bold mb-8 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>
          Order History
        </h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Clock className={`w-5 h-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {new Date(order.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  order.status === 'Processing'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64?text=Not+Found';
                        }}
                      />
                      <div>
                        <p className={`font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {item.title}
                        </p>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className={`font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      ${((item.pricePerServing * item.quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className={`mt-6 pt-6 border-t ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span className={`text-lg font-bold ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    Total
                  </span>
                  <span className="text-xl font-bold text-primary">
                    ${(order.total / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}