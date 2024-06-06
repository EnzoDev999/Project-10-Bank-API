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
  async (transaction, { getState }) => {
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
    return response.data.body;
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
        state.transactions.push(action.payload);
      });
  },
});

export default transactionSlice.reducer;
