import axios from "axios";

export default async function getMaticPrice() {
  const { data } = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
    params: { ids: "matic-network", vs_currencies: "usd" },
  });
  if (data) {
    return parseFloat(data?.["matic-network"]?.usd).toFixed(2);
  }
}
