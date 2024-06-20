import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { loadUser } from "./slices/authSlice";
import Home from "./components/Home/Home";
import SignIn from "./components/SignIn/SignIn";
import User from "./components/User/User";
import TransactionsList from "./components/TransactionList";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [token, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/user" element={<ProtectedRoute element={User} />} />
      <Route
        path="/transactions"
        element={<ProtectedRoute element={TransactionsList} />}
      />
    </Routes>
  );
};

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
