import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    navbar: {
        brandLogo: "",
        loggedInItemsDetails: [],
        nonLoggedInItemsDetails: [],
      },
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
        setNavbar: (state, action) => {
            state.navbar = action.payload;
          },
    },
});

export const { reducer, actions } = contentfulSlice;

//actions
export const{
    setMiscData,
    setNavbar,
} = actions;

//selectors
export const selectMiscData = (state) => state.contentful.miscData;
export const selectNavbar = (state) => state.contentful.navbar;