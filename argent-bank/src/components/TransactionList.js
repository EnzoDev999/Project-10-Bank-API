import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactionsForCurrentMonth } from "../slices/transactionSlice";
import { loadUser } from "../slices/authSlice";
import AddTransaction from "./AddTransaction";
import TransactionItem from "./TransactionItem";
import argentBankLogo from "../assets/img/argentBankLogo.png";

const TransactionsList = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.transactions);
  const transactionStatus = useSelector((state) => state.transactions.status);
  const error = useSelector((state) => state.transactions.error);
  const userStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(loadUser());
    }
  }, [userStatus, dispatch]);

  useEffect(() => {
    if (transactionStatus === "idle" && userStatus === "succeeded") {
      dispatch(fetchTransactionsForCurrentMonth());
    }
  }, [transactionStatus, userStatus, dispatch]);

  useEffect(() => {
    console.log("Transaction status:", transactionStatus);
    console.log("User status:", userStatus);
    console.log("Transactions:", transactions);
    console.log("Error:", error);
  }, [transactionStatus, userStatus, transactions, error]);

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
  } else if (transactionStatus === "failed" || userStatus === "failed") {
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
      <h2>Transactions</h2>
      <AddTransaction />
      {content}
    </section>
  );
};

export default TransactionsList;
