import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    error: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem("token", action.payload);
    },
    loginFail: (state, action) => {
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, loginFail, logout } = authSlice.actions;

export const login = (username, password) => async (dispatch) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/api/v1/user/login",
      {
        email: username,
        password: password,
      }
    );
    dispatch(loginSuccess(response.data.body.token));
  } catch (error) {
    dispatch(loginFail(error.response.data.message));
  }
};

export default authSlice.reducer;
