require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");
require("@typechain/hardhat");
require("hardhat-gas-reporter");
require("solidity-coverage");

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xac0974bec39a17e36...";
const providerApiKey = process.env.ALCHEMY_API_KEY || "demo-key";
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
