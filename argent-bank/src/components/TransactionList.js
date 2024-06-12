// TransactionsList.js
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactionsForCurrentMonth,
  setAccountType,
} from "../slices/transactionSlice";
import { loadUser } from "../slices/authSlice";
import AddTransaction from "./AddTransaction";
import TransactionItem from "./TransactionItem";
import argentBankLogo from "../assets/img/argentBankLogo.png";

const TransactionsList = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.transactions);
  const transactionStatus = useSelector((state) => state.transactions.status);
  const error = useSelector((state) => state.transactions.error);
  const accountType = useSelector((state) => state.transactions.accountType);
  const user = useSelector((state) => state.auth.user);
  const userStatus = useSelector((state) => state.auth.status);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(loadUser());
    }
  }, [userStatus, dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accountTypeParam = params.get("accountType");
    if (accountTypeParam) {
      dispatch(setAccountType(accountTypeParam));
    }
  }, [location.search, dispatch]);

  useEffect(() => {
    if (accountType && userStatus === "succeeded") {
      dispatch(fetchTransactionsForCurrentMonth(accountType));
      navigate({ search: `?accountType=${accountType}` }, { replace: true }); // Mettre à jour l'URL
    }
  }, [dispatch, accountType, userStatus, navigate]);

  const handlePrevAccount = () => {
    const types = ["checking", "savings", "credit"];
    const currentIndex = types.indexOf(accountType);
    const newIndex = (currentIndex - 1 + types.length) % types.length;
    dispatch(setAccountType(types[newIndex]));
  };

  const handleNextAccount = () => {
    const types = ["checking", "savings", "credit"];
    const currentIndex = types.indexOf(accountType);
    const newIndex = (currentIndex + 1) % types.length;
    dispatch(setAccountType(types[newIndex]));
  };

  const getCurrentBalance = () => {
    if (!user) return 0;
    switch (accountType) {
      case "checking":
        return user.checkingBalance;
      case "savings":
        return user.savingsBalance;
      case "credit":
        return user.creditBalance;
      default:
        return 0;
    }
  };

  let content;

  if (transactionStatus === "loading" || userStatus === "loading") {
    content = <div>Loading...</div>;
  } else if (transactionStatus === "succeeded") {
    if (transactions.length > 0) {
      content = (
        <ul>
          {transactions.map((transaction) => (
            <TransactionItem key={transaction._id} transaction={transaction} />
          ))}
        </ul>
      );
    } else {
      content = <div>No transactions found</div>;
    }
  } else if (transactionStatus === "failed") {
    content = <div>{error}</div>;
  }

  return (
    <section className="transactions">
      <Link className="main-nav-logo" to="/user">
        <img
          className="main-nav-logo-image"
          src={argentBankLogo}
          alt="Argent Bank Logo"
        />
      </Link>
      <h2>Transactions {accountType}</h2>
      <div>
        <button onClick={handlePrevAccount}>Previous</button>
        <span>Balance: ${getCurrentBalance()}</span>
        <button onClick={handleNextAccount}>Next</button>
      </div>
      <AddTransaction />
      {content}
    </section>
  );
};

export default TransactionsList;
