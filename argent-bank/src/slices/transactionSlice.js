import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTransactionsForCurrentMonth = createAsyncThunk(
  "transactions/fetchTransactionsForCurrentMonth",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    const user = getState().auth.user;

    if (!user) {
      console.log("User not loaded");
      return rejectWithValue("User not loaded");
    }

    try {
      const response = await axios.get(
        "http://localhost:3001/api/v1/transactions/current-month",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const transactions = response.data.data;

      let currentBalance = user.balance;
      const transactionsWithBalance = transactions.map((transaction, index) => {
        const transactionWithBalance = {
          ...transaction,
          balance: currentBalance,
        };
        currentBalance -= transaction.amount;
        return transactionWithBalance;
      });

      console.log("Transactions with balance:", transactionsWithBalance);
      return transactionsWithBalance;
    } catch (error) {
      console.log("Error fetching transactions:", error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transaction, { getState, dispatch }) => {
    const token = getState().auth.token;
    const response = await axios.post(
      "http://localhost:3001/api/v1/transactions",
      transaction,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await dispatch(fetchTransactionsForCurrentMonth());
    return response.data.body;
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (transaction, { getState, dispatch }) => {
    const token = getState().auth.token;
    const response = await axios.put(
      `http://localhost:3001/api/v1/transactions/${transaction.id}`,
      transaction,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await dispatch(fetchTransactionsForCurrentMonth());
    return response.data.body;
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (transactionId, { getState }) => {
    const token = getState().auth.token;
    await axios.delete(
      `http://localhost:3001/api/v1/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return transactionId;
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsForCurrentMonth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTransactionsForCurrentMonth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactions = action.payload;
      })
      .addCase(fetchTransactionsForCurrentMonth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.status = "idle"; // Recharger la liste des transactions
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.status = "idle"; // Recharger la liste des transactions
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.status = "idle"; // Recharger la liste des transactions
      });
  },
});

export default transactionSlice.reducer;
