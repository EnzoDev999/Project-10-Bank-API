import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateTransaction,
  deleteTransaction,
  fetchTransactionsForCurrentMonth,
} from "../slices/transactionSlice";
import "./Transactions.css";

const TransactionItem = ({ transaction }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(transaction.amount);
  const [type, setType] = useState(transaction.type);
  const [description, setDescription] = useState(transaction.description);
  const dispatch = useDispatch();

  const handleUpdate = async () => {
    await dispatch(
      updateTransaction({ id: transaction._id, amount, type, description })
    );
    await dispatch(fetchTransactionsForCurrentMonth(transaction.accountType)); // Recharger les transactions après la mise à jour
    setIsEditing(false);
    window.location.reload();
  };

  const handleDelete = async () => {
    await dispatch(deleteTransaction(transaction._id));
    await dispatch(fetchTransactionsForCurrentMonth(transaction.accountType)); // Recharger les transactions après la suppression
    window.location.reload();
  };

  return (
    <li>
      {isEditing ? (
        <div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <span>{transaction.date}</span>
          <span>{transaction.description}</span>
          <span>${transaction.amount}</span>
          <span>
            Balance: $
            {transaction.balanceAfterTransaction !== undefined
              ? transaction.balanceAfterTransaction
              : "N/A"}
          </span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </li>
  );
};

export default TransactionItem;
