# 🦄 SimpleSwap DApp – EthKipu TP4

This project is a decentralized application (DApp) built as part of the EthKipu course – Module 3. It allows users to interact with a SimpleSwap smart contract deployed on the Sepolia testnet. Users can swap between two ERC20 tokens (TokenA and TokenB), view token prices, and connect their wallets using MetaMask.

---

## 🌐 Live Demo

👉 [Access the frontend (Vercel)](https://your-vercel-deployment.vercel.app)  
👉 [Contract on Sepolia](https://sepolia.etherscan.io/address/0x37cd582b320b78c4B23d7d50eA2cB11426694dF9)

---

## 🧠 Features

- Swap **Token A → Token B** and vice versa
- View token price via `getPrice(tokenA, tokenB)`
- MetaMask wallet integration
- Automatic approval of token before swapping
- Minimal and responsive UI
- Displays user token balances

---

## 🚀 Technologies

- Solidity (Smart Contract)
- Hardhat + TypeScript
- Ethers.js
- React + Next.js (Scaffold-ETH 2)
- TailwindCSS
- Vercel (for deployment)

---

## 📦 Contracts

| Name        | Address                                    |
|-------------|---------------------------------------------|
| `TokenA`     | `0x37C6B46eCA55cFD97D28707490bCE944911a33c3` |
| `TokenB`     | `0x4c06E3BdDF0e87f993287A5744Bc63Fc1282e613` |
| `SimpleSwap` | `0x37cd582b320b78c4B23d7d50eA2cB11426694dF9` |

Contracts were verified on [Sepolia Etherscan](https://sepolia.etherscan.io/).

---

## 🛠 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Walter185/TP4-Scaffold.git
cd TP4-Scaffold
pnpm install
```

Start local blockchain (optional):

```bash
cd packages/hardhat
pnpm chain
pnpm deploy
```

Start frontend:

```bash
cd packages/nextjs
pnpm dev
```

Access at [http://localhost:3000](http://localhost:3000)

---

## 🧪 Run Tests & Check Coverage

```bash
cd packages/hardhat
pnpm test
pnpm coverage
```

✔️ Coverage achieved: **93.22%** (TP requirement ≥ 50%)

---

## 📤 Deploy Frontend

We use [Vercel](https://vercel.com/) to deploy the frontend.

Steps:

1. Push the project to GitHub
2. Go to [vercel.com](https://vercel.com/)
3. Import your GitHub repo
4. Set framework to **Next.js**
5. Deploy

---

## 🙌 Acknowledgements

Special thanks to:

- **Cris** – for the clarity and Solidity guidance  
- **Juan David** – for the support and feedback throughout the course

---

## 👨‍💻 Author

**Walter Liendo**  
EthKipu Blockchain Developer – 2025  
Argentina 🇦🇷 | Uruguay 🇺🇾

---

## 📘 License

This project is MIT licensed.
