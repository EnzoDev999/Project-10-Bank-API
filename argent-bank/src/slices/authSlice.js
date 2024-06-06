import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    error: null,
    user: null, // Ajouter l'état pour les informations utilisateur
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
      state.user = null;
      localStorage.removeItem("token");
    },
    userLoaded: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    userLoadFailed: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { loginSuccess, loginFail, logout, userLoaded, userLoadFailed } =
  authSlice.actions;

export const login = (username, password) => async (dispatch) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/api/v1/user/login",
      {
        email: username,
        password: password,
      }
    );
    console.log("Login response:", response); // Ajoute ceci
    dispatch(loginSuccess(response.data.body.token));
  } catch (error) {
    console.log("Login error:", error); // Ajoute ceci
    dispatch(loginFail(error.response.data.message));
  }
};

export const loadUser = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const response = await axios.get(
      "http://localhost:3001/api/v1/user/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Load user response:", response); // Ajoute ceci
    dispatch(userLoaded(response.data.body));
  } catch (error) {
    console.log("Load user error:", error); // Ajoute ceci
    dispatch(userLoadFailed(error.response.data.message));
  }
};

export default authSlice.reducer;
