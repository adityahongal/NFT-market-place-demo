import * as ipfsClient from "ipfs-http-client";
const projectId = process.env.REACT_APP_INFURA_PROJECT_ID;
const projectSecret = process.env.REACT_APP_INFURA_PROJECT_SECRET;

const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const IPFS = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default IPFS;
