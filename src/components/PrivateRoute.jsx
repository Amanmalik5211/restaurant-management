import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;