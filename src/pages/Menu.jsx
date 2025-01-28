import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu, searchMenu, setSearchQuery } from '../store/menuSlice';
import { addToCart } from '../store/cartSlice';
import Pagination from '../components/Pagination';
import { useTheme } from '../context/ThemeContext';
import { Search, Filter, ShoppingCart } from 'react-feather';
import { toast } from 'react-hot-toast';

export default function Menu() {
  const dispatch = useDispatch();
  const { items, loading, error, searchQuery, totalItems } = useSelector((state) => state.menu);
  const { isDarkMode } = useTheme();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      dispatch(fetchMenu({ page: currentPage, limit: itemsPerPage }));
    }
  }, [dispatch, currentPage, itemsPerPage, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      dispatch(setSearchQuery(localSearchQuery));
      dispatch(searchMenu({
        query: localSearchQuery,
        page: 1,
        limit: itemsPerPage,
        fields: ['title', 'summary', 'diets']
      }));
      setCurrentPage(1);
    } else {
      dispatch(setSearchQuery(''));
      dispatch(fetchMenu({ page: 1, limit: itemsPerPage }));
    }
  };

  const handleSearch = (e) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    toast.success(
      <div className="flex items-center gap-2">
        <ShoppingCart className="w-4 h-4" />
        <span>{item.title} added to cart!</span>
      </div>,
      {
        duration: 2000,
        position: 'bottom-right',
        style: {
          background: isDarkMode ? '#333' : '#fff',
          color: isDarkMode ? '#fff' : '#333',
          border: `1px solid ${isDarkMode ? '#444' : '#eee'}`,
        },
      }
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (searchQuery) {
      dispatch(searchMenu({
        query: searchQuery,
        page: pageNumber,
        limit: itemsPerPage,
        fields: ['title', 'summary', 'diets']
      }));
    } else {
      dispatch(fetchMenu({ page: pageNumber, limit: itemsPerPage }));
    }
  };

  // Sort items
  const sortedItems = [...items].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'price':
        comparison = a.pricePerServing - b.pricePerServing;
        break;
      case 'readyTime':
        comparison = a.readyInMinutes - b.readyInMinutes;
        break;
      default:
        comparison = 0;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} 
        flex justify-center items-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary">
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} 
        flex flex-col justify-center items-center`}>
        <div className={`text-xl ${isDarkMode ? 'text-red-400' : 'text-red-600'} mb-4`}>
          {error}
        </div>
        <button
          onClick={() => dispatch(fetchMenu({ page: 1, limit: itemsPerPage }))}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark 
            transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} 
      transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
      <h1 className= {`text-center text-5xl font-extrabold mb-8 tracking-wide ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} `}>
        Our Menu
      </h1>
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8"
      >
        <div className="relative w-full md:w-3/4">
          <input
            type="text"
            placeholder="Search by name, description, or diet..."
            value={localSearchQuery}
            onChange={handleSearch}
            className={`w-full pl-12 pr-4 py-3 rounded-lg border shadow-sm text-sm focus:ring-2 focus:ring-primary transition-all duration-300 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-gray-200'
                : 'bg-white border-gray-300'
            }`}
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition duration-300 shadow-md flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 rounded-lg border shadow-md transition duration-300 flex items-center gap-2 ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 border-gray-600'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>
      </form>

      {showFilters && (
        <div
        className={`w-full pl-12 pr-4 py-3 rounded-lg border shadow-sm text-sm focus:ring-2 focus:ring-primary transition-all duration-300 ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700 text-gray-200'
            : 'bg-white border-gray-300'
        }`}
        >
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className={`w-15 px-4 py-2 rounded-lg border shadow-sm text-sm focus:ring-2 focus:ring-primary transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-200'
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="title">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="readyTime">Sort by Preparation Time</option>
            </select>
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className={`px-4 py-2 rounded-lg border shadow-sm transition duration-300 ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
        </div>
      )}

        {sortedItems.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No items found. Try a different search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-lg shadow-md overflow-hidden hover:shadow-xl 
                  transform hover:-translate-y-1 transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-xl font-semibold ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {item.title}
                    </h3>
                    <span className="text-primary font-bold">
                      ${((item.pricePerServing || 0) / 100).toFixed(2)}
                    </span>
                  </div>
                  <p className={`mb-4 line-clamp-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.summary?.replace(/<[^>]*>/g, '')}
                  </p>
                  <div className={`text-sm mb-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <p>Ready in: {item.readyInMinutes} minutes</p>
                    <p>Servings: {item.servings}</p>
                    {item.diets?.length > 0 && (
                      <p className="mt-1">
                        <span className="font-semibold">Diets: </span>
                        {item.diets.join(', ')}
                      </p>
                    )}
                  </div>
                  <button
                    className="w-full bg-primary text-white px-4 py-2 rounded-lg 
                      hover:bg-primary-dark transform hover:-translate-y-0.5 
                      transition-all duration-300 flex items-center justify-center gap-2"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {sortedItems.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}