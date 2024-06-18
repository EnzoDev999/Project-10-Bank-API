// AddTransaction.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTransaction } from "../slices/transactionSlice";

const AddTransaction = () => {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const dispatch = useDispatch();
  const accountType = useSelector((state) => state.transactions.accountType);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      amount: parseFloat(amount),
      type, // Assure-toi que ce champ est bien inclus
      category,
      accountType,
    };
    dispatch(addTransaction(newTransaction));
    setAmount("");
    setType("");
    setCategory("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button type="submit">Add Transaction</button>
    </form>
  );
};

export default AddTransaction;
