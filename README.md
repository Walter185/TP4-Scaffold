# SimpleSwap DApp – Scaffold-ETH Integration

This is a decentralized token swap application built using **Hardhat**, **TypeScript**, and **Scaffold-ETH**. The project implements a custom `SimpleSwap` smart contract inspired by Uniswap V2, featuring add/remove liquidity and token swap functionalities.

## 🧱 Smart Contracts

Deployed to the **Sepolia** testnet:

- **TokenA**: [`0x2c5dE7ce59F2540Fc6993966b12A4F92D3f8Bd28`](https://sepolia.etherscan.io/address/0x2c5dE7ce59F2540Fc6993966b12A4F92D3f8Bd28)
- **TokenB**: [`0x9167460d361769a62A447847EEecE91Df135d8f6`](https://sepolia.etherscan.io/address/0x9167460d361769a62A447847EEecE91Df135d8f6)
- **SimpleSwap**: [`0xBF24790A19EB7b52944bC0a514bc9848a4C56387`](https://sepolia.etherscan.io/address/0xBF24790A19EB7b52944bC0a514bc9848a4C56387)

## 🧪 Features

- ✅ Add/remove liquidity with slippage protection and LP token minting
- 🔁 Swap token A ↔ token B using constant product formula
- 📈 Price estimation and output calculation
- 🔬 Full frontend integration via Scaffold-ETH with Ethers.js
- 🧪 Unit testing and test coverage with Hardhat and solidity-coverage
- 🧩 Verified contracts on Etherscan

## 📂 Project Structure

```
packages/
├── hardhat/         # Smart contracts and deploy scripts
└── nextjs/          # Scaffold-ETH frontend
```

## ⚙️ Commands

### Compile Contracts

```
yarn hardhat compile
```

### Deploy to Sepolia

```
yarn hardhat deploy --network sepolia
```

### Verify Contracts

```
yarn hardhat verify --network sepolia <address> <constructor_args>
```

### Run Tests

```
yarn hardhat test
```

### Run Coverage

```
npx hardhat coverage
```

### Generate Frontend Types

```
yarn generate
```

## 🌐 Frontend

- Scaffold-ETH v2 based UI
- Network-aware: Sepolia integration
- Debug Contracts tab (auto-generated from deployments)
- Burner wallet for local testing

## ✅ Requirements Met (TP4 - EthKipu)

- [x] Frontend working with deployed SimpleSwap
- [x] Contracts verified on Sepolia
- [x] Tests written and executed
- [x] Scaffold-ETH UI integration
- [x] Project hosted on GitHub

## 🙏 Acknowledgements

Special thanks to:

- **EthKipu** instructors and community
- **Scaffold-ETH** team for the open-source framework
- **OpenZeppelin** for secure ERC20 implementations
- **Hardhat** for powerful tooling

---

Made with 💙 by **Walter Liendo – EthKipu Student**