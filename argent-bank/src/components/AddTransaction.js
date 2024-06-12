import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTransaction } from "../slices/transactionSlice";

const AddTransaction = () => {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense"); // Définir un type par défaut
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const accountType = useSelector((state) => state.transactions.accountType);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      amount: parseFloat(amount),
      type,
      description,
      accountType,
    };
    dispatch(addTransaction(newTransaction));
    setAmount("");
    setType("expense"); // Réinitialiser au type par défaut
    setDescription("");
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
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Add Transaction</button>
    </form>
  );
};

export default AddTransaction;
