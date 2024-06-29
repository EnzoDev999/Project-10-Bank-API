import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactionsForCurrentMonth,
  setAccountType,
} from "../slices/transactionSlice";
import { loadUser } from "../slices/authSlice";
import TransactionItem from "./TransactionItem";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "./Transactions.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Fonction de formatage
const formatAmount = (amount) => {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

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
    console.log("User:", user);
    console.log("User ID:", user?._id);
    if (accountType && userStatus === "succeeded" && user && user._id) {
      console.log("Fetching transactions for userId:", user._id);
      dispatch(
        fetchTransactionsForCurrentMonth({ userId: user._id, accountType })
      );
      navigate({ search: `?accountType=${accountType}` }, { replace: true });
    }
  }, [dispatch, accountType, userStatus, user, navigate]);

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
    content = <div className="loading-spinner"></div>;
  } else if (transactionStatus === "succeeded") {
    if (transactions.length > 0) {
      content = transactions.map((transaction) => (
        <TransactionItem key={transaction._id} transaction={transaction} />
      ));
    } else {
      content = <div className="no-transactions">No transactions found</div>;
    }
  } else if (transactionStatus === "failed") {
    content = <div>{error}</div>;
  }

  return (
    <div>
      <div className="account-informations">
        <h2>Argent Bank {accountType}</h2>
        <div className="account-navigation">
          <FontAwesomeIcon
            icon={faChevronLeft}
            onClick={handlePrevAccount}
            className="left-arrow"
          />
          <span>${formatAmount(getCurrentBalance())}</span>
          <FontAwesomeIcon
            icon={faChevronRight}
            onClick={handleNextAccount}
            className="right-arrow"
          />
        </div>
        <span className="balance-desc">Available Balance</span>
      </div>
      <section className="transactions">
        <div className="transactions-container">
          <div className="transactions-header"></div> {/* Empty header cell */}
          <div className="transactions-header">DATE</div>
          <div className="transactions-header">DESCRIPTION</div>
          <div className="transactions-header">AMOUNT</div>
          <div className="transactions-header">BALANCE</div>
          {content}
        </div>
      </section>
    </div>
  );
};

export default TransactionsList;
