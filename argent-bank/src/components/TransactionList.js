import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../slices/transactionSlice";

const TransactionsList = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.transactions);
  const transactionStatus = useSelector((state) => state.transactions.status);
  const error = useSelector((state) => state.transactions.error);

  useEffect(() => {
    if (transactionStatus === "idle") {
      dispatch(fetchTransactions());
    }
  }, [transactionStatus, dispatch]);

  let content;

  if (transactionStatus === "loading") {
    content = <div>Loading...</div>;
  } else if (transactionStatus === "succeeded") {
    if (transactions.length > 0) {
      content = (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              {transaction.description}: {transaction.amount}
            </li>
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
    <section>
      <h2>Transactions</h2>
      {content}
    </section>
  );
};

export default TransactionsList;
