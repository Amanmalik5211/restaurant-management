import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '../../context/ThemeContext';

export default function Layout() {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow ${isDarkMode ? 'dark:bg-dark-bg' : 'bg-gray-50'} transition-colors duration-300`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}