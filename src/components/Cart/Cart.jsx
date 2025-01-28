import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../../store/cartSlice';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft } from 'react-feather';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const cart = useSelector((state) => state.cart);
  const items = cart?.items || [];
  const navigate = useNavigate();
  const handleCheckout = () => {
    if (items.length > 0) {
      navigate('/checkout', { 
        state: { 
          items,
          subtotal,
          tax,
          shipping,
          total
        } 
      });
    } else {
      toast.error('Your cart is empty!');
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    try {
      dispatch(updateQuantity({
        itemId,
        quantity: parseInt(newQuantity)
      }));
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = (itemId) => {
    try {
      dispatch(removeFromCart(itemId));
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        dispatch(clearCart());
        toast.success('Cart cleared');
      } catch (error) {
        toast.error('Failed to clear cart');
      }
    }
  };

  if (!items.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2 dark:text-gray-200">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding some delicious items to your cart!
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg 
              hover:bg-primary-dark transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + (item.pricePerServing * item.quantity), 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal >= 5000 ? 0 : 500;
  const total = subtotal + tax + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold dark:text-gray-200">Shopping Cart</h2>
            <span className="text-gray-600 dark:text-gray-400">{items.length} items</span>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`${
                  isDarkMode ? 'bg-dark-card' : 'bg-white'
                } rounded-lg shadow-md p-4 flex items-center gap-4`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/96?text=No+Image';
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold dark:text-gray-200">{item.title}</h3>
                  <p className="text-primary font-semibold">
                    ${((item.pricePerServing || 0) / 100).toFixed(2)} each
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <label htmlFor={`quantity-${item.id}`} className="sr-only">Quantity</label>
                      <select
                        id={`quantity-${item.id}`}
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="border rounded-lg px-3 py-1 bg-gray-50 dark:bg-gray-700 
                          dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 
                          focus:ring-primary focus:border-transparent"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-600 transition-colors duration-300"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Subtotal: ${((item.pricePerServing * item.quantity) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-600 transition-colors duration-300 
                  flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className={`${
            isDarkMode ? 'bg-dark-card' : 'bg-white'
          } rounded-lg shadow-md p-6 sticky top-4`}>
            <h3 className="text-xl font-semibold mb-4 dark:text-gray-200">Order Summary</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between dark:text-gray-300">
                <span>Subtotal ({items.length} items)</span>
                <span>${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between dark:text-gray-300">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${(shipping / 100).toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between dark:text-gray-300">
                <span>Tax (10%)</span>
                <span>${(tax / 100).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold text-lg dark:text-gray-200">
                  <span>Total</span>
                  <span>${(total / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
               onClick={handleCheckout}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark 
                transition-colors duration-300"
            >
              Proceed to Checkout
            </button>
            <Link
              to="/menu"
              className="w-full border border-gray-300 text-gray-700 dark:text-gray-300 
                dark:border-gray-600 py-2 rounded-lg flex items-center justify-center gap-2 
                hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 mt-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}