import { combineReducers } from "@reduxjs/toolkit";

import { reducer as walletReducer } from "./slices/wallet";
import { reducer as layoutReducer } from "./slices/layout";

const rootReducer = combineReducers ({
    wallet: walletReducer,
    layout: layoutReducer,
})

export default rootReducer;