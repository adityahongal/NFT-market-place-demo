import { createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import keccak256 from "keccak256";
import { signSmartContractData } from "@wert-io/widget-sc-signer";
import { v4 as uuidv4 } from "uuid";
import Web3 from "web3";
import { signTypedData_v4 } from "eth-sig-util";
import IPFS from "../../utils/InfuraIPFSConnector";
import ERC721 from "../../artifacts/contracts/ERC721.sol/MIKONFT721.json";
import ERC1155 from "../../artifacts/contracts/ERC1155.sol/MIKONFT1155.json";
import MikoMarketPlace from "../../artifacts/contracts/MIKOMarketPlace.sol/MIKOMarketPlace.json";
import getMaticPrice from "../../utils/getMaticPrice";
import { inflateGasPrice, getRechargeAmt } from "./../../utils/misc";
import { web3wallet } from "../../utils/walletConnect.utils";
import { updateUser } from "./user";
import { signSmartContractDataApi } from "./../../api/externalService";
import { getSdkError } from "@walletconnect/utils";
import axios from "axios";

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
    setWalletExists(state, action) {
      const { walletExists } = action.payload;
      state.walletExists = walletExists;
    },
    setLoading(state, action) {
      const { loading } = action.payload;
      state.loading = loading;
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

export const setWalletFromPvtKey =
  ({ pvtKey, mutate }) =>
  async (dispatch) => {
    dispatch(slice.actions.setLoading({ loading: true }));
    let wallet = new ethers.Wallet(pvtKey);

    if (wallet !== undefined && wallet !== null) {
      const provider = new ethers.providers.InfuraProvider(
        process.env.REACT_APP_INFURA_CHAIN_NAME,
        process.env.REACT_APP_INFURA_PROVIDER_ID
      );
      wallet = wallet.connect(provider);

      mutate(wallet.address.toLowerCase());

      dispatch(updateUser({ address: wallet.address.toLowerCase() }));
      dispatch(slice.actions.setWallet({ wallet: wallet }));
      dispatch(slice.actions.setLoggedIn({ loggedIn: true }));
    }
    dispatch(slice.actions.setLoading({ loading: false }));
  };

export const login =
  ({ password, mutate, onSuccess = () => {}, onError = () => {} }) =>
  async (dispatch) => {
    try {
      const encryptedWallet = localStorage.getItem("wallet");
      const parsedWallet = JSON.parse(encryptedWallet);

      if (parsedWallet !== undefined && parsedWallet !== null) {
        const provider = new ethers.providers.InfuraProvider(
          process.env.REACT_APP_INFURA_CHAIN_NAME,
          process.env.REACT_APP_INFURA_PROVIDER_ID
        );

        var wallet = await ethers.Wallet.fromEncryptedJson(
          parsedWallet,
          password
        );

        if (wallet !== undefined && wallet !== null) {
          savePvtKeyToLocalStorage(wallet.privateKey);
          wallet = wallet.connect(provider);

          mutate(wallet.address.toLowerCase());

          dispatch(updateUser({ address: wallet.address.toLowerCase() }));
          dispatch(slice.actions.setWallet({ wallet: wallet }));
          dispatch(slice.actions.setLoggedIn({ loggedIn: true }));
        }
        onSuccess();
      }
    } catch (err) {
      console.log(err);
      onError();
    }
  };

export const checkWalletExistsLocally = () => async (dispatch) => {
  const encryptedWallet = localStorage.getItem("wallet");
  const parsedWallet = JSON.parse(encryptedWallet);

  if (parsedWallet !== undefined && parsedWallet !== null) {
    dispatch(slice.actions.setWalletExists({ walletExists: true }));
  } else {
    dispatch(slice.actions.setWalletExists({ walletExists: false }));
  }
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
    } catch (error) {
      console.log(error);
    }
  };

export const mint721Artwork =
  ({
    artwork,
    wallet,
    originUrl = "",
    miko_id = "",
    userDetails,
    minterAddress,
    royaltyReceiverAddress,
    getNativeBalance,
    updateUserDetails,
    navigate = () => {},
    onSuccess = () => {},
  }) =>
  async (dispatch) => {
    try {
      if (!minterAddress) {
        throw new Error("Minter contract not found");
      }
      if (!royaltyReceiverAddress) {
        throw new Error("Royalty receiver contract not found");
      }

      const { data: balanceResponse } = await getNativeBalance({
        chain: process.env.REACT_APP_MORALIS_CHAIN_NAME,
        address: wallet.address,
      });
      const { balance } = balanceResponse;
      const currentUserMaticBalance = ethers.utils.formatEther(balance);
      const MaticPriceInUSD = await getMaticPrice();

      // MetaData Management
      const NFTMetadata = {
        name: artwork.name,
        description: artwork.description,
        image: artwork.image,
      };

      const NFTMetadataRes = await IPFS.add(JSON.stringify(NFTMetadata), {
        pin: true,
      });
      const NFTMetadataUri = "https://ipfs.io/ipfs/" + NFTMetadataRes.path;

      if (!userDetails?.miko_id && miko_id) {
        updateUserDetails({
          id: userDetails.id,
          address: userDetails.address,
          miko_id,
        });
      }
      console.log(userDetails);

      // Deploy ERC721Contract for particular user and check if already exists
      let contractAddress = userDetails?.erc721_address;

      if (!contractAddress) {
        const ERC721Factory = new ethers.ContractFactory(
          ERC721.abi,
          ERC721.bytecode,
          wallet
        );

        // Gas estimate for deployment
        const deployeEstimatGas = await wallet.provider.estimateGas(
          ERC721Factory.getDeployTransaction().data
        );
        const formattedDeployeEstimatGas =
          ethers.utils.formatEther(deployeEstimatGas);
        const inflatedDeployEstimatGas = inflateGasPrice(
          formattedDeployeEstimatGas
        );

        if (
          Number(inflatedDeployEstimatGas) > Number(currentUserMaticBalance) ||
          Number(currentUserMaticBalance).toFixed(2) === "0.00"
        ) {
          navigate("/recharge", {
            state: {
              redirectedFrom: originUrl,
              rechargeAmt: getRechargeAmt(
                inflatedDeployEstimatGas,
                MaticPriceInUSD
              ),
            },
          });
        }

        const ERC721Contract = await ERC721Factory.deploy();
        await ERC721Contract.deployed();

        contractAddress = ERC721Contract.address;

        updateUserDetails({
          id: userDetails.id,
          address: userDetails.address,
          erc721_address: contractAddress.toLowerCase(),
        });

        const ERC721ContractInstance = new ethers.Contract(
          contractAddress,
          ERC721.abi,
          wallet
        );

        // Gas estimate for granting role + minting
        const grantRoleGasEstimate =
          await ERC721ContractInstance.estimateGas.grantRole(
            keccak256("MINTER_ROLE"),
            minterAddress
          );
        const formattedGrantRoleGasEstimate =
          ethers.utils.formatEther(grantRoleGasEstimate);
        const inflatedGrandRoleGasEstimate = inflateGasPrice(
          formattedGrantRoleGasEstimate
        );
        const mintGasEstimate =
          await ERC721ContractInstance.estimateGas.safeMint(
            wallet.address,
            NFTMetadataUri
          );
        const formattedMinGasEstimate =
          ethers.utils.formatEther(mintGasEstimate);
        const inflatedMinGasEstimate = inflateGasPrice(formattedMinGasEstimate);
        const totalGasEstimate =
          inflatedGrandRoleGasEstimate + inflatedMinGasEstimate;

        if (
          Number(totalGasEstimate) > Number(currentUserMaticBalance) ||
          Number(currentUserMaticBalance).toFixed(2) === "0.00"
        ) {
          navigate("/recharge", {
            state: {
              redirectedFrom: originUrl,
              rechargeAmt: getRechargeAmt(totalGasEstimate, MaticPriceInUSD),
            },
          });
        }

        const RoleResponse = await ERC721ContractInstance.grantRole(
          keccak256("MINTER_ROLE"),
          minterAddress
        );
        await RoleResponse.wait();
      }

      const ERC721ContractInstance = new ethers.Contract(
        contractAddress,
        ERC721.abi,
        wallet
      );

      if (contractAddress) {
        // Gas estimate for  minting and set Royalty
        const setRoyaltyGasEstimate =
          await ERC721ContractInstance.estimateGas.setRoyalties(
            royaltyReceiverAddress
          );
        const formattedSetRoyaltyGasEstimate = ethers.utils.formatEther(
          setRoyaltyGasEstimate
        );
        const inflatedSetRoyaltyGasEstimate = inflateGasPrice(
          formattedSetRoyaltyGasEstimate
        );
        const mintGasEstimate =
          await ERC721ContractInstance.estimateGas.safeMint(
            wallet.address,
            NFTMetadataUri
          );
        const formattedMinGasEstimate =
          ethers.utils.formatEther(mintGasEstimate);
        const inflatedMinGasEstimate = inflateGasPrice(formattedMinGasEstimate);
        const totalGasEstimate =
          inflatedSetRoyaltyGasEstimate + inflatedMinGasEstimate;

        if (
          Number(totalGasEstimate) > Number(currentUserMaticBalance) ||
          Number(currentUserMaticBalance).toFixed(2) === "0.00"
        ) {
          navigate("/recharge", {
            state: {
              redirectedFrom: originUrl,
              rechargeAmt: getRechargeAmt(
                inflatedMinGasEstimate,
                MaticPriceInUSD
              ),
            },
          });
        }
      }

      const RoyaltiesSetterResponse = await ERC721ContractInstance.setRoyalties(
        royaltyReceiverAddress
      );
      await RoyaltiesSetterResponse.wait();

      const NFTMintingResponse = await ERC721ContractInstance.safeMint(
        wallet.address,
        NFTMetadataUri
      );

      await NFTMintingResponse.wait();
      await axios.get(
        `https://deep-index.moralis.io/api/v2/${wallet.address}/nft`,
        {
          params: {
            chain: process.env.REACT_APP_MORALIS_CHAIN_NAME,
            format: "decimal",
          },
          headers: {
            accept: "application/json",
            "X-API-Key": process.env.REACT_APP_MORALIS_API_KEY,
          },
        }
      );
      await onSuccess();
    } catch (err) {
      console.log(err);
    }
  };

  export const mint1155Artwork =
  ({
    artwork = {},
    wallet,
    originUrl = "",
    miko_id = "",
    userDetails,
    quantity = 2,
    isRemint = false,
    existing_token_id = -1, // only required for reminting
    existing_contact_address = "", // only required for reminting
    minterAddress,
    royaltyReceiverAddress,
    getNativeBalance,
    updateUserDetails,
    navigate = () => {},
    onSuccess = () => {},
  }) =>
  async (dispatch) => {
    try {
      if (!minterAddress) {
        throw new Error("Minter contract not found");
      }
      if (!royaltyReceiverAddress) {
        throw new Error("Royalty receiver contract not found");
      }

      const { data: balanceResponse } = await getNativeBalance({
        chain: process.env.REACT_APP_MORALIS_CHAIN_NAME,
        address: wallet.address,
      });
      const { balance } = balanceResponse;
      const currentUserMaticBalance = ethers.utils.formatEther(balance);
      const MaticPriceInUSD = await getMaticPrice();

      if (!userDetails?.miko_id && miko_id) {
        updateUserDetails({
          id: userDetails.id,
          address: userDetails.address,
          miko_id,
        });
      }

      let ERC1155ContractInstance = null;

      if (isRemint) {
        if (
          Number(existing_token_id) === -1 &&
          existing_contact_address === ""
        ) {
          throw new Error("Invalid token id or contract address");
        }
        ERC1155ContractInstance = new ethers.Contract(
          existing_contact_address,
          ERC1155.abi,
          wallet
        );
        const mintGasEstimate = await ERC1155ContractInstance.estimateGas.mint(
          wallet.address,
          Number(existing_token_id),
          Number(quantity), // quantity,
          "0x" // any data
        );
        const formattedMinGasEstimate =
          ethers.utils.formatEther(mintGasEstimate);
        const inflatedMinGasEstimate = inflateGasPrice(formattedMinGasEstimate);

        if (
          Number(inflatedMinGasEstimate) > Number(currentUserMaticBalance) ||
          Number(currentUserMaticBalance).toFixed(2) === "0.00"
        ) {
          navigate("/recharge", {
            state: {
              redirectedFrom: originUrl,
              rechargeAmt: getRechargeAmt(
                inflatedMinGasEstimate,
                MaticPriceInUSD
              ),
            },
          });
        }
        const NFTMintingResponse = await ERC1155ContractInstance.mint(
          wallet.address,
          Number(existing_token_id),
          Number(quantity), // quantity,
          "0x" // any data
        );
        await NFTMintingResponse.wait();
      } else {
        const NFTMetadata = {
          name: artwork.name,
          description: artwork.description,
          image: artwork.image,
        };

        const NFTMetadataRes = await IPFS.add(JSON.stringify(NFTMetadata), {
          pin: true,
        });
        const NFTMetadataUri = "https://ipfs.io/ipfs/" + NFTMetadataRes.path;

        const ERC1155Factory = new ethers.ContractFactory(
          ERC1155.abi,
          ERC1155.bytecode,
          wallet
        );

        // Gas estimate for deployment
        const deployeEstimatGas = await wallet.provider.estimateGas(
          ERC1155Factory.getDeployTransaction().data
        );
        const formattedDeployeEstimatGas =
          ethers.utils.formatEther(deployeEstimatGas);
        const inflatedDeployEstimatGas = inflateGasPrice(
          formattedDeployeEstimatGas
        );

        if (
          Number(inflatedDeployEstimatGas) > Number(currentUserMaticBalance) ||
          Number(currentUserMaticBalance).toFixed(2) === "0.00"
        ) {
          navigate("/recharge", {
            state: {
              redirectedFrom: originUrl,
              rechargeAmt: getRechargeAmt(
                inflatedDeployEstimatGas,
                MaticPriceInUSD
              ),
            },
          });
        }

        const ERC1155Contract = await ERC1155Factory.deploy();

        await ERC1155Contract.deployed();
        const contractAddress = ERC1155Contract.address;

        ERC1155ContractInstance = await new ethers.Contract(
          contractAddress,
          ERC1155.abi,
          wallet
        );
        const grantRoleGasEstimate =
          await ERC1155ContractInstance.estimateGas.grantRole(
            keccak256("MINTER_ROLE"),
            minterAddress
          );

        const formattedGrantRoleGasEstimate =
          ethers.utils.formatEther(grantRoleGasEstimate);
        const inflatedGrandRoleGasEstimate = inflateGasPrice(
          formattedGrantRoleGasEstimate
        );
        const setRoyaltiesGasEstimate =
          await ERC1155ContractInstance.estimateGas.setRoyalties(
            royaltyReceiverAddress
          );

        const formattedSetRoyaltiesGasEstimate = ethers.utils.formatEther(
          setRoyaltiesGasEstimate
        );
        const inflatedSetRoyaltiesGasEstimate = inflateGasPrice(
          formattedSetRoyaltiesGasEstimate
        );
        const setURIGasEstimate =
          await ERC1155ContractInstance.estimateGas.setURI(NFTMetadataUri);

        const formattedSetURIGasEstimate =
          ethers.utils.formatEther(setURIGasEstimate);
        const inflatedSetURIGasEstimate = inflateGasPrice(
          formattedSetURIGasEstimate
        );
        const mintGasEstimate = await ERC1155ContractInstance.estimateGas.mint(
          wallet.address,
          0,
          Number(quantity), // quantity,
          "0x" // any data
        );

        const formattedMinGasEstimate =
          ethers.utils.formatEther(mintGasEstimate);
        const inflatedMinGasEstimate = inflateGasPrice(formattedMinGasEstimate);
        const totalGasEstimate =
          inflatedGrandRoleGasEstimate +
          inflatedMinGasEstimate +
          inflatedSetRoyaltiesGasEstimate +
          inflatedSetURIGasEstimate;

        if (
          Number(totalGasEstimate) > Number(currentUserMaticBalance) ||
          Number(currentUserMaticBalance).toFixed(2) === "0.00"
        ) {
          navigate("/recharge", {
            state: {
              redirectedFrom: originUrl,
              rechargeAmt: getRechargeAmt(totalGasEstimate, MaticPriceInUSD),
            },
          });
        }

        const RoleResponse = await ERC1155ContractInstance.grantRole(
          keccak256("MINTER_ROLE"),
          minterAddress
        );
        await RoleResponse.wait();
        const RoyaltiesSetterResponse =
          await ERC1155ContractInstance.setRoyalties(royaltyReceiverAddress);
        await RoyaltiesSetterResponse.wait();
        const BaseUriResponse = await ERC1155ContractInstance.setURI(
          NFTMetadataUri
        );
        await BaseUriResponse.wait();

        const NFTMintingResponse = await ERC1155ContractInstance.mint(
          wallet.address,
          0,
          Number(quantity), // quantity,
          "0x" // any data
        );

        await NFTMintingResponse.wait();

        await axios.get(
          `https://deep-index.moralis.io/api/v2/${wallet.address}/nft`,
          {
            params: {
              chain: process.env.REACT_APP_MORALIS_CHAIN_NAME,
              format: "decimal",
            },
            headers: {
              accept: "application/json",
              "X-API-Key": process.env.REACT_APP_MORALIS_API_KEY,
            },
          }
        );
      }
      await onSuccess();
    } catch (err) {
      console.log(err);
    }
  };

