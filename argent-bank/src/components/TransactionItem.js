import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateTransaction,
  deleteTransaction,
  fetchTransactionsForCurrentMonth,
} from "../slices/transactionSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
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
    await dispatch(fetchTransactionsForCurrentMonth(transaction.accountType));
    setIsEditingCategory(false);
    setIsEditingNotes(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteTransaction(transaction._id));
    await dispatch(fetchTransactionsForCurrentMonth(transaction.accountType));
    window.location.reload();
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

  // Format the date here
  const formattedDate = new Date(transaction.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  console.log(
    "Description de la transaction affichée :",
    transaction.description
  ); // Log de la description affichée
  return (
    <>
      <div
        className={`transaction-summary ${isExpanded ? "expanded" : ""}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="icon-container">
          <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
        </div>
        <div>{formattedDate}</div> {/* Use the formatted date here */}
        <div>{transaction.description}</div>
        <div>${transaction.amount}</div>
        <div>${transaction.balanceAfterTransaction}</div>
      </div>
      {isExpanded && (
        <div className="transaction-details">
          <div>
            <span>Transaction Type:</span>
            {transaction.type}
          </div>
          <div>
            <span>Category:</span>
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
                {category}{" "}
                <FontAwesomeIcon
                  className="transaction-details-icon"
                  icon={faPen}
                  onClick={handleStartEditCategory}
                />
              </span>
            )}
          </div>
          <div>
            <span>Notes:</span>
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
                {notes}{" "}
                <FontAwesomeIcon
                  className="transaction-details-icon"
                  icon={faPen}
                  onClick={handleStartEditNotes}
                />
              </span>
            )}
          </div>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </>
  );
};

export default TransactionItem;
