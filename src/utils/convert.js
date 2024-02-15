const { utils } = require("ethers");

function fromDecimalToHex(number) {
  if (typeof number !== "number") throw "The input provided should be a number";
  return `0x${number.toString(16)}`;
}

function fromHexToDecimal(hex) {
  if (typeof hex !== "string") throw "The input provided should be a string";
  return parseInt(hex, 16);
}

function fromHexToUTf8(hex) {
  const isHex = utils.isHexString(hex);
  if (isHex) {
    try {
      return utils.toUtf8String(hex);
    } catch(error) {
      return ""
    }
  } else {
    throw "The input provided should be a hex";
  }
}

module.exports = {
  fromDecimalToHex,
  fromHexToDecimal,
  fromHexToUTf8,
};
