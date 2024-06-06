import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    error: null,
    user: null,
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
    profileUpdateSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    profileUpdateFailed: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  loginSuccess,
  loginFail,
  logout,
  userLoaded,
  userLoadFailed,
  profileUpdateSuccess,
  profileUpdateFailed,
} = authSlice.actions;

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
    dispatch(userLoaded(response.data.body));
  } catch (error) {
    dispatch(userLoadFailed(error.response.data.message));
  }
};

export const updateUserProfile =
  (firstName, lastName) => async (dispatch, getState) => {
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
      dispatch(profileUpdateSuccess(response.data.body));
    } catch (error) {
      dispatch(profileUpdateFailed(error.response.data.message));
    }
  };

export default authSlice.reducer;
