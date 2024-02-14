export const getCustomGatewayUrl = (url) => {
    const newUrl = url.replace("https://ipfs.io/ipfs/", "https://miko.infura-ipfs.io/ipfs/");
    return newUrl;
  };

// function to convert matic to usd
export const convertMaticToUsd = (maticAmt, maticUsdPric) => {
  const usdAmt = Number(Number(maticAmt) * Number(maticUsdPric)).toFixed(4);
  return Number(usdAmt).toFixed(4);
};

// function to add 10% extra to gas estimate
export const inflateGasPrice = (gasPrice) => {
  const inflated = Number(Number(gasPrice) + Number(gasPrice) * 0.1).toFixed(18);
  return Number(inflated).toFixed(18);
};

// function to get recharge amount
export const getRechargeAmt = (estimateGas, MaticPriceInUSD) => {
  let rechargeAmt = 5;
  const estimateGasUsd = convertMaticToUsd(estimateGas, MaticPriceInUSD);
  if (estimateGasUsd > 5) {
    rechargeAmt = convertMaticToUsd(estimateGas, MaticPriceInUSD);
  }
  return rechargeAmt;
};