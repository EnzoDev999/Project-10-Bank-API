// Permet de savoir si le hook vérifie correctement l'expiration du token
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./slices/authSlice";

const useTokenExpiration = () => {
  const [isExpired, setIsExpired] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const expiration = localStorage.getItem("tokenExpiration");
      if (!expiration) {
        console.log("No expiration found, assuming token is expired");
        return true;
      }
      const expirationDate = new Date(expiration);
      const currentDate = new Date();
      const isExpired = currentDate >= expirationDate;
      return isExpired;
    };

    if (checkTokenExpiration()) {
      console.log("Token has expired, logging out");
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      dispatch(logout());
      setIsExpired(true);
    }
  }, [dispatch]);

  return isExpired;
};

export default useTokenExpiration;
