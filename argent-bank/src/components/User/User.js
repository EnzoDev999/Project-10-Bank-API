import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, updateUserProfile } from "../../slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import "./User.css";

const formatAmount = (amount) => {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const User = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sign-in");
    } else {
      dispatch(loadUser());
    }
  }, [isAuthenticated, dispatch, navigate]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
  }, [user]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile(firstName, lastName));
    setEditMode(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <main className="main">
        <div className="header">
          <h1>
            Welcome back
            <br />
            {user.firstName} {user.lastName}!
          </h1>
          <button
            className="edit-button"
            onClick={() => setEditMode(!editMode)}
          >
            Edit Name
          </button>
        </div>
        {editMode && (
          <form className="edit-form" onSubmit={handleUpdateProfile}>
            <div className="edit-form-inputs">
              <div>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </form>
        )}
        <h2 className="sr-only">Accounts</h2>
        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Checking (x8349)</h3>
            <p className="account-amount">
              ${formatAmount(user.checkingBalance)}
            </p>
            <p className="account-amount-description">Available Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <Link
              className="transaction-button"
              to="/transactions?accountType=checking"
            >
              View transactions
            </Link>
          </div>
        </section>
        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Savings (x6712)</h3>
            <p className="account-amount">
              ${formatAmount(user.savingsBalance)}
            </p>
            <p className="account-amount-description">Available Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <Link
              className="transaction-button"
              to="/transactions?accountType=savings"
            >
              View transactions
            </Link>
          </div>
        </section>
        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
            <p className="account-amount">
              ${formatAmount(user.creditBalance)}
            </p>
            <p className="account-amount-description">Current Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <Link
              className="transaction-button"
              to="/transactions?accountType=credit"
            >
              View transactions
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default User;
