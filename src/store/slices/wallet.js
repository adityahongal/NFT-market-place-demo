import { createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { updateUser } from "./user";

// Redux and actions
const initialState = {
  err: "",
  chains: [],
  balances: {},
  NFTbalance: [],

  // Wallet connect state
  loading: false,
  scanner: false,
  peerMeta: [],
  chainId: "",
  accounts: [],
  address: "",
  requests: [],
  payload: [],
  connector: [],

  // wallet state
  seedPhrase: "",
  reEnteredSeedPhrase: "",
  walletLoaded: false,
  wallet: {},
  walletExists: false,
  loggedIn: false,

  // wallet connect v2 state
  relayerRegionURL: "",
  uri: "",
  connected: false,
  connectedDApp: {},
};

const slice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    // wallet state
    setSeedPhrase(state, action) {
      const { phrase } = action.payload;
      state.seedPhrase = phrase;
    },
    setReEnteredSeedPhrase(state, action) {
        const { phrase } = action.payload;
        state.reEnteredSeedPhrase = phrase;
      },
    setWallet(state, action) {
      const { wallet } = action.payload;
      state.wallet = wallet;
    },
    setLoggedIn(state, action) {
        const { loggedIn } = action.payload;
        state.loggedIn = loggedIn;
      },
  },
});

export const reducer = slice.reducer;

export const { setReEnteredSeedPhrase } = slice.actions;

// Actions and web3 functions

export const createWallet =
  (onComplete = () => {}) =>
  async (dispatch) => {
    try {
      const wallet = ethers.Wallet.createRandom();
      dispatch(slice.actions.setSeedPhrase({ phrase: wallet.mnemonic.phrase }));
      onComplete();
    } catch (err) {
      console.error(err);
    }
  };

const savePvtKeyToLocalStorage = (pvtKey) => {
  const totalPvtKeyLength = pvtKey.length;
  const firstPartLength = Math.round(totalPvtKeyLength / 3);
  const secondPartLength = Math.round(
    (totalPvtKeyLength - firstPartLength) / 2
  );
  localStorage.setItem("delta", pvtKey.slice(0, firstPartLength));
  localStorage.setItem(
    "alpha",
    pvtKey.slice(firstPartLength, firstPartLength + secondPartLength)
  );
  localStorage.setItem(
    "beta",
    pvtKey.slice(firstPartLength + secondPartLength)
  );
};

export const setWallet =
  ({ seedPhrase, password, createUser = () => {}, onComplete = () => {} }) =>
  async (dispatch) => {
    try {
      let wallet = ethers.Wallet.fromMnemonic(seedPhrase);

      savePvtKeyToLocalStorage(wallet.privateKey);

      const encryptedWallet = await wallet.encrypt(password);
      localStorage.setItem("wallet", JSON.stringify(encryptedWallet));
      const provider = new ethers.providers.InfuraProvider(
        process.env.REACT_APP_INFURA_CHAIN_NAME,
        process.env.REACT_APP_INFURA_PROVIDER_ID
      );
      wallet = wallet.connect(provider);

      const accountDeatils = {
        address: wallet.address.toLowerCase(),
        name: "Enter name",
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${wallet?.address}`,
        background_image:
          "https://images.unsplash.com/photo-1642370324100-324b21fab3a9?w=500",
      };

      createUser(accountDeatils);

      dispatch(updateUser({ address: wallet.address.toLowerCase() }));

      dispatch(slice.actions.setWallet({ wallet }));
      dispatch(slice.actions.setLoggedIn({ loggedIn: true }));
      onComplete();
    } catch (error) {console.log(error);}
  };
