import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateTransaction,
  deleteTransaction,
  fetchTransactionsForCurrentMonth,
} from "../slices/transactionSlice";
import "./Transactions.css";

const TransactionItem = ({ transaction }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [category, setCategory] = useState(transaction.category || "");
  const [notes, setNotes] = useState(transaction.notes || "");

  const [initialCategory, setInitialCategory] = useState(category);
  const [initialNotes, setInitialNotes] = useState(notes);

  const dispatch = useDispatch();

  const handleUpdate = async () => {
    await dispatch(updateTransaction({ id: transaction._id, category, notes }));
    await dispatch(fetchTransactionsForCurrentMonth(transaction.accountType)); // Recharger les transactions après la mise à jour
    setIsEditingCategory(false);
    setIsEditingNotes(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteTransaction(transaction._id));
    await dispatch(fetchTransactionsForCurrentMonth(transaction.accountType)); // Recharger les transactions après la suppression
  };

  const handleCancelEdit = () => {
    setCategory(initialCategory);
    setNotes(initialNotes);
    setIsEditingCategory(false);
    setIsEditingNotes(false);
  };

  const handleStartEditCategory = () => {
    setInitialCategory(category);
    setIsEditingCategory(true);
  };

  const handleStartEditNotes = () => {
    setInitialNotes(notes);
    setIsEditingNotes(true);
  };

  return (
    <li>
      <div onClick={() => setIsExpanded(!isExpanded)}>
        <span>{transaction.date}</span>
        <span>{transaction.category}</span>
        <span>${transaction.amount}</span>
        <span>Balance: ${transaction.balanceAfterTransaction}</span>
      </div>
      {isExpanded && (
        <div className="transaction-details">
          <div>
            <strong>Transaction Type:</strong> {transaction.type}
          </div>
          <div>
            <strong>Category:</strong>
            {isEditingCategory ? (
              <div>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <button onClick={handleUpdate}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <span>
                {category} <button onClick={handleStartEditCategory}>✎</button>
              </span>
            )}
          </div>
          <div>
            <strong>Notes:</strong>
            {isEditingNotes ? (
              <div>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <button onClick={handleUpdate}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <span>
                {notes} <button onClick={handleStartEditNotes}>✎</button>
              </span>
            )}
          </div>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </li>
  );
};

export default TransactionItem;
