import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get(
      "http://localhost:3001/api/v1/transactions",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.body;
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (transaction, { getState, dispatch }) => {
    const token = getState().auth.token;
    const accountType = getState().transactions.accountType; // Récupérer le type de compte actuel
    const response = await axios.put(
      `http://localhost:3001/api/v1/transactions/${transaction.id}`,
      transaction,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await dispatch(fetchTransactionsForCurrentMonth(accountType));
    return response.data.data; // Utiliser data au lieu de body
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (transactionId, { getState, dispatch }) => {
    const token = getState().auth.token;
    const accountType = getState().transactions.accountType; // Récupérer le type de compte actuel
    await axios.delete(
      `http://localhost:3001/api/v1/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await dispatch(fetchTransactionsForCurrentMonth(accountType));
    return transactionId;
  }
);

export const fetchTransactionsForCurrentMonth = createAsyncThunk(
  "transactions/fetchTransactionsForCurrentMonth",
  async ({ userId, accountType }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;

    console.log(
      "Fetching transactions for userId:",
      userId,
      "accountType:",
      accountType
    );

    if (!userId) {
      return rejectWithValue("User ID is required");
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/api/v1/transactions/current-month?accountType=${accountType}&userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const transactions = response.data.data;

      console.log("Fetched transactions:", transactions);

      let currentBalance;
      switch (accountType) {
        case "checking":
          currentBalance = getState().auth.user.checkingBalance;
          break;
        case "savings":
          currentBalance = getState().auth.user.savingsBalance;
          break;
        case "credit":
          currentBalance = getState().auth.user.creditBalance;
          break;
        default:
          currentBalance = 0;
      }

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

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    status: "idle",
    error: null,
    accountType: "",
  },
  reducers: {
    setAccountType: (state, action) => {
      state.accountType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // .addCase(addTransaction.fulfilled, (state, action) => {
      //   state.transactions.unshift(action.payload);
      //   state.status = "idle"; // Recharger la liste des transactions
      // })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (transaction) => transaction._id === action.payload._id
        );
        state.transactions[index] = action.payload;
        state.status = "idle"; // Recharger la liste des transactions
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (transaction) => transaction._id !== action.payload
        );
        state.status = "idle"; // Recharger la liste des transactions
      })
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
      });
  },
});

export const { setAccountType } = transactionSlice.actions;

export default transactionSlice.reducer;
