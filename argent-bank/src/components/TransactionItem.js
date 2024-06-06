import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateTransaction,
  deleteTransaction,
} from "../slices/transactionSlice";
import "./Transactions.css";

const TransactionItem = ({ transaction }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(transaction.amount);
  const [type, setType] = useState(transaction.type);
  const [description, setDescription] = useState(transaction.description);
  const dispatch = useDispatch();

  const handleUpdate = () => {
    dispatch(
      updateTransaction({ id: transaction._id, amount, type, description })
    );
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch(deleteTransaction(transaction._id));
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
          <span>
            {transaction.description}: {transaction.amount}
          </span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </li>
  );
};

export default TransactionItem;
