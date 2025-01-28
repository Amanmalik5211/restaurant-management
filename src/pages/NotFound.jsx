import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function NotFound() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`flex flex-col items-center justify-center min-h-[60vh] ${
      isDarkMode ? 'text-dark-text' : 'text-gray-800'
    }`}>
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page not found</p>
      <Link
        to="/"
        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300"
      >
        Go Home
      </Link>
    </div>
  );
}