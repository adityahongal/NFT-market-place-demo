export const getCustomGatewayUrl = (url) => {
    const newUrl = url.replace("https://ipfs.io/ipfs/", "https://miko.infura-ipfs.io/ipfs/");
    return newUrl;
  };