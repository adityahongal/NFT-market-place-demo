import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  address: "",
  bio: "",
  name: "",
  avatar: "",
  background_image: "",
  erc721_address: "",
  miko_id: "",
  is_featured: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const {
        id = "",
        address = "",
        bio = "",
        name = "",
        avatar = "",
        background_image = "",
        erc721_address = "",
        miko_id = "",
        is_featured = false,
      } = action.payload;

      state.id = id;
      state.address = address;
      state.bio = bio || "";
      state.name = name;
      state.avatar = avatar;
      state.background_image = background_image || "";
      state.erc721_address = erc721_address || "";
      state.miko_id = miko_id || "";
      state.is_featured = is_featured;
    },
    updateUserName: (state, action) => {
      state.name = action.payload;
    },
    updateUserAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    updateUserBackgroundImage: (state, action) => {
      state.background_image = action.payload;
    },
    updatedErc721ContractAdd: (state, action) => {
      state.erc721_address = action.payload;
    },
    updateUserBio: (state, action) => {
      state.bio = action.payload;
    },
    updateUserMikoId: (state, action) => {
      state.miko_id = action.payload;
    },
    updateUserIsFeatured: (state, action) => {
      state.is_featured = action.payload;
    },
    updateUser: (state, action) => Object.assign(state, { ...state, ...action.payload }),
    resetUser: (state) => Object.assign(state, initialState),
  },
});

export const {
  setUser,
  updateUserBio,
  updateUserName,
  updateUserAvatar,
  updateUserBackgroundImage,
  updatedErc721ContractAdd,
  updateUserMikoId,
  updateUserIsFeatured,
  updateUser,
  resetUser,
} = userSlice.actions;

export const userStateSelector = (state) => state.user;

export const reducer = userSlice.reducer;
