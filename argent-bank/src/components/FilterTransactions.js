import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchTransactionsByMonthAndAccount } from "../slices/transactionSlice";

const FilterTransactions = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [accountId, setAccountId] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchTransactionsByMonthAndAccount({ month, year, accountId }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="month">Month</label>
        <input
          type="number"
          id="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="year">Year</label>
        <input
          type="number"
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="accountId">Account ID</label>
        <input
          type="text"
          id="accountId"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          required
        />
      </div>
      <button type="submit">Filter</button>
    </form>
  );
};

export default FilterTransactions;
