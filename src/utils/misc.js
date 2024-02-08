export const getCustomGatewayUrl = (url) => {
    const newUrl = url.replace("https://ipfs.io/ipfs/", "https://miko.infura-ipfs.io/ipfs/");
    return newUrl;
  };

// function to convert matic to usd
export const convertMaticToUsd = (maticAmt, maticUsdPric) => {
  const usdAmt = Number(Number(maticAmt) * Number(maticUsdPric)).toFixed(4);
  return Number(usdAmt).toFixed(4);
};