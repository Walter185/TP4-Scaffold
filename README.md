# 🦄 SimpleSwap DEX

This project implements a decentralized exchange (DEX) similar to Uniswap V2, written in Solidity and powered by React and Scaffold-ETH for the frontend.

## 📦 Contracts Deployed on Sepolia

- **TokenA**: [0x2c5dE7ce59F2540Fc6993966b12A4F92D3f8Bd28](https://sepolia.etherscan.io/address/0x2c5dE7ce59F2540Fc6993966b12A4F92D3f8Bd28)
- **TokenB**: [0x9167460d361769a62A447847EEecE91Df135d8f6](https://sepolia.etherscan.io/address/0x9167460d361769a62A447847EEecE91Df135d8f6)
- **SimpleSwap**: [0xBF24790A19EB7b52944bC0a514bc9848a4C56387](https://sepolia.etherscan.io/address/0xBF24790A19EB7b52944bC0a514bc9848a4C56387)

## 🚀 Functionality

### ✅ Smart Contract Features

- **Liquidity Management**
  - `addLiquidity`
  - `removeLiquidity`
- **Swapping**
  - `swapExactTokensForTokens`
- **Price and Estimation**
  - `getPrice`
  - `getAmountOut`
- **Math Utils**
  - `sqrt`

### 🧪 Testing

Unit tests written in TypeScript using Hardhat and Chai cover core functions:

- ✅ Add Liquidity
- ✅ Remove Liquidity
- ✅ Token Swap
- ✅ Expired Deadlines
- ✅ Price Query

Coverage achieved:

Statements: 97.37%
Branches: 50.00%
Functions: 100.00%
Lines: 93.22%

> ✅ All values meet EthKipu's minimum requirement of **≥ 50%**

### 📁 Folder Structure

packages/
├── hardhat/
│ ├── contracts/
│ │ ├── SimpleSwap.sol
│ │ ├── TokenA.sol
│ │ └── TokenB.sol
│ ├── deploy/
│ │ ├── 00_deploy.ts
│ │ └── 03_add_liquidity.ts
│ ├── test/
│ │ └── SimpleSwap.test.ts
│ └── hardhat.config.ts
├── nextjs/
│ └── (React + Scaffold-ETH frontend)


## 🖼️ Frontend Features

- Wallet connection (MetaMask)
- Swap UI with token selection
- Liquidity pool status
- Real-time price display
- Token faucet available to test transactions
- Uses `wagmi`, `viem`, and `rainbowkit` for connection and transactions

## 🧪 Deployment & Verification

**Deployment command:**

```bash
yarn hardhat deploy --network sepolia

Contract verification:

yarn hardhat verify --network sepolia <contract_address> <constructor_args>

📽️ Demonstration
If you choose to submit a video instead of a deployed frontend, make sure to:

✅ Show approve call from frontend

✅ Use getAmountOut or getPrice

✅ Perform a successful transaction and verify it on Sepolia Etherscan

🧠 NatSpec & Audit Readiness
All contracts are documented using Solidity NatSpec, including:

All public and external functions

Events with full parameter descriptions

State variables and modifiers

🏁 Getting Started

cd packages/hardhat
cp .env.example .env
yarn install
yarn deploy --network sepolia

cd packages/nextjs
cp .env.example .env.local
yarn install
yarn dev

🙌 Acknowledgements
Scaffold-ETH 2

OpenZeppelin Contracts

Hardhat

Viem

EthKipu

👨‍🎓 Developed by Walter Liendo – Student at EthKipu