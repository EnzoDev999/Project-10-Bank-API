import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useTokenExpiration from "../useTokenExpiration";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isTokenExpired = useTokenExpiration();

  if (isTokenExpired || !isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
