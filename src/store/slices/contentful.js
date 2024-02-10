import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    miscData: {
        createWalletSuccessText: "",
        delistArtworkSuccessText: "",
        loginSuccessText: "",
        nftListedSuccessText: "",
        nftTransferSuccessText: "",
        priceUpdateSuccessText: "",
        recoverWalletSuccessText: "",
      },
};

const contentfulSlice = createSlice({
    name: "contentful",
    initialState,
    reducers: {
        setMiscData: (state, action) => {
            state.miscData = action.payload;
          },
    },
});

export const { reducer, actions } = contentfulSlice;

//actions
export const{
    setMiscData,
} = actions;

//selectors
export const selectMiscData = (state) => state.contentful.miscData;