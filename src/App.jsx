import { Routes, Route } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Cart from './components/Cart/Cart';
import Checkout from './pages/Checkout ';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';
import OrderHistory from './pages/OrderHistory';
function App() {
  const theme = useTheme();
  const isDarkMode = theme?.isDarkMode ?? false;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className={`min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300`}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Menu />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="order-history" element={<OrderHistory />}/>
            <Route path="/login" element={<Login />} />
            
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Checkout/>
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;