import { combineReducers } from "@reduxjs/toolkit";

import { reducer as walletReducer } from "./slices/wallet";
import { reducer as layoutReducer } from "./slices/layout";
import { reducer as userReducer } from "./slices/user";

const rootReducer = combineReducers ({
    wallet: walletReducer,
    layout: layoutReducer,
    user: userReducer,
})

export default rootReducer;