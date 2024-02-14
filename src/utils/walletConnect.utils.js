import { Web3Wallet } from '@walletconnect/web3wallet';
import { Core } from '@walletconnect/core';
import { buildApprovedNamespaces } from '@walletconnect/utils';
export let web3wallet;

const methods = [
    "eth_signTransaction",
    "eth_sign",
    "eth_signTypedData",
    "eth_signTypedData_v4",
    "eth_sendTransaction",
    "personal_sign"
];

const chains = [
    "eip155:80001",
    "eip155:137"
];

export async function createWeb3Wallet(relayerRegionURL, uri) {
    const core = new Core({
      projectId: process.env.REACT_APP_WALLETCONNECT_ID,
      relayUrl: relayerRegionURL ?? process.env.REACT_APP_PUBLIC_RELAY_URL
    })
    web3wallet = await Web3Wallet.init({
      core,
      metadata: {
        name: 'Miko',
        description: 'Miko Blockchain wallet for NFT marketplace',
        url: 'https://miko.ai/',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
      }
    })
  
    try {
      const clientId = await web3wallet.engine.signClient.core.crypto.getClientId()

      console.log('WalletConnect ClientID: ', clientId)
      localStorage.setItem('WALLETCONNECT_CLIENT_ID', clientId)
      
    } catch (error) {
      console.error('Failed to set WalletConnect clientId in localStorage: ', error)
    }
};

export function getApprovedNamespaces(params, address) {
    return buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces: {
          eip155: {
            chains: chains,
            methods: methods,
            events: ['accountsChanged', 'chainChanged'],
            accounts: [
                `eip155:80001:${address}`,
                `eip155:137:${address}`,
            ]
          }
        }
    });

    
}
