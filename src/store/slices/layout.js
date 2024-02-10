import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  walletCreate: {
    currentContext: "", // create / existing / login
    createWalletStep: 0,
    existingWalletStep: 0,
    loginStep: 0,
  },
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setCurrentContext: (state, action) => {
      const { context = "", type = "" } = action.payload;

      state[type].currentContext = context;
    },
    setCreateWalletStep: (state, action) => {
      state.walletCreate.createWalletStep = action.payload;
    },
    setExistingWalletStep: (state, action) => {
      state.walletCreate.existingWalletStep = action.payload;
    },
    setLoginStep: (state, action) => {
      state.walletCreate.loginStep = action.payload;
    },
    resetWalletCreate: (state, action) => {
      state.walletCreate = initialState.walletCreate;
    },
  },
});

export const layoutStateSelector = (state) => state.layout;
export const connectWalletStateSelector = (state) => state.layout.walletCreate;

export const reducer = layoutSlice.reducer;

export const { 
    setCreateWalletStep, 
    setCurrentContext,
    setExistingWalletStep,
    setLoginStep,
    resetWalletCreate, 
} = layoutSlice.actions;
