import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { loadUser } from "./slices/authSlice";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import User from "./components/User";
import TransactionsList from "./components/TransactionList";

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [token, dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route
          path="/user"
          element={isAuthenticated ? <User /> : <Navigate to="/sign-in" />}
        />
        <Route
          path="/transactions"
          element={
            isAuthenticated ? <TransactionsList /> : <Navigate to="/sign-in" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
