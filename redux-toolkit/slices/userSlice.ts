import { userData } from "@/types/common.type";
import { createSlice } from "@reduxjs/toolkit";
import { destroyCookie } from "nookies";
import { userSliceData } from "../interfaces/interfaces";
import { setUserAccessToken } from "@/api/axiosInstance";
import { deleteCookie } from "cookies-next";

const initialState: userSliceData = {
  accessToken: null,
  isLoggedIn: false,
  userData: null
};

export const userSlice = createSlice({
  name: "userSlice",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLoginData: (state, { payload }: { payload: userData }) => {
      state.userData = payload;
      state.isLoggedIn = true;
    },
    setAccessToken: (state, { payload }: { payload: string | null }) => {
      state.accessToken = payload;
      state.isLoggedIn = Boolean(payload);
      setUserAccessToken(payload);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userData = null;
      state.accessToken = null;
      deleteCookie('token');
      window.location.href = "/login";
    }
  },
  extraReducers: {}
});

export const { setLoginData, logout, setAccessToken } = userSlice.actions;

export default userSlice.reducer;
