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

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transaction, { getState, dispatch }) => {
    const token = getState().auth.token;
    const accountType = getState().transactions.accountType; // Récupérer le type de compte actuel
    console.log("Transaction à envoyer :", transaction);
    const response = await axios.post(
      "http://localhost:3001/api/v1/transactions",
      { ...transaction, accountType }, // Ajouter le type de compte à la transaction
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Transaction ajoutée :", response.data.data); // Log de la nouvelle transaction
    console.log(
      "Description de la transaction ajoutée :",
      response.data.data.description
    ); // Log de la description ajoutée
    await dispatch(fetchTransactionsForCurrentMonth(accountType));
    return response.data.data; // Utiliser data au lieu de body
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
  async (accountType, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    const user = getState().auth.user;

    if (!user) {
      console.log("User not loaded");
      return rejectWithValue("User not loaded");
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/api/v1/transactions/current-month?accountType=${accountType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const transactions = response.data.data;

      let currentBalance;
      switch (accountType) {
        case "checking":
          currentBalance = user.checkingBalance;
          break;
        case "savings":
          currentBalance = user.savingsBalance;
          break;
        case "credit":
          currentBalance = user.creditBalance;
          break;
        default:
          currentBalance = 0;
      }

      const transactionsWithBalance = transactions.map((transaction, index) => {
        const transactionWithBalance = {
          ...transaction,
          balance: currentBalance, // modification ici
        };
        currentBalance -= transaction.amount; // La balance est soustraite ici une seule fois
        return transactionWithBalance;
      });

      // Ajout un délai artificiel ici
      await new Promise((resolve) => setTimeout(resolve, 300));

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
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
        state.status = "idle"; // Recharger la liste des transactions
      })
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
