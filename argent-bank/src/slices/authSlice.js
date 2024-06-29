import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    isAuthenticated: localStorage.getItem("token") ? true : null,
    loading: true,
    error: null,
    user: null,
    status: "idle",
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("tokenExpiration", action.payload.expiration);
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
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
    },
    userLoaded: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.status = "succeeded";
      state.balance = action.payload.balance;
    },
    userLoadFailed: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.status = "failed";
    },
  },
});

export const { loginSuccess, loginFail, logout, userLoaded, userLoadFailed } =
  authSlice.actions;

const isTokenExpired = () => {
  const expiration = localStorage.getItem("tokenExpiration");
  if (!expiration) {
    return true;
  }
  const expirationDate = new Date(expiration);
  const currentDate = new Date();
  return currentDate >= expirationDate;
};

export const login = (username, password) => async (dispatch) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/api/v1/user/login",
      {
        email: username,
        password: password,
      }
    );
    dispatch(loginSuccess(response.data.body));
  } catch (error) {
    dispatch(loginFail(error.response.data.message));
  }
};

export const loadUser = () => async (dispatch, getState) => {
  if (isTokenExpired()) {
    dispatch(logout());
    return;
  }

  try {
    const token = getState().auth.token;
    if (!token) {
      dispatch(userLoadFailed("No token found"));
      return;
    }
    const response = await axios.get(
      "http://localhost:3001/api/v1/user/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(userLoaded(response.data.body));
  } catch (error) {
    console.log("Error loading user:", error); // Ajoutez ce log
    dispatch(userLoadFailed(error.response.data.message));
  }
};

export const updateUserProfile =
  (firstName, lastName) => async (dispatch, getState) => {
    if (isTokenExpired()) {
      dispatch(logout());
      return;
    }

    try {
      const token = getState().auth.token;
      const response = await axios.put(
        "http://localhost:3001/api/v1/user/profile",
        {
          firstName,
          lastName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(userLoaded(response.data.body));
    } catch (error) {
      dispatch(userLoadFailed(error.response.data.message));
    }
  };

export default authSlice.reducer;
