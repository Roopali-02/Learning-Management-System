import React from 'react'
import {
	Navigate,
	useLocation
} from 'react-router-dom';
import {
	jwtDecode
} from 'jwt-decode';


const ProtectedRoute = ({children}) => {
	const location = useLocation();
	const token = localStorage.getItem('token');

	const isTokenExpired = (token) => {
		if (!token) return true; 
		const {exp} = jwtDecode(token);
		return exp * 1000 < Date.now();
	};
	if (isTokenExpired(token)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

	return children;
}

export default ProtectedRoute;