# SimpleSwap DApp

**Student:** Walter Liendo

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Prerequisites](#prerequisites)  
3. [Installation](#installation)  
4. [Environment Configuration](#environment-configuration)  
5. [Smart Contracts](#smart-contracts)  
   - [TokenA](#tokena)  
   - [TokenB](#tokenb)  
   - [SimpleSwap](#simpleswap)  
6. [Deployment](#deployment)  
7. [Testing & Coverage](#testing--coverage)  
8. [Front‑End Application](#front‑end-application)  
9. [Verification on Etherscan](#verification-on-etherscan)  
10. [Usage](#usage)  
11. [Contributing](#contributing)  
12. [License](#license)

---

## Project Overview

**SimpleSwap** is a minimalist decentralized exchange (DEX) built on Ethereum. It allows users to:
- Swap between two ERC‑20 tokens (**TokenA** & **TokenB**).  
- Provide or withdraw liquidity through an automated market maker (AMM).  

This repository includes:
- Mintable ERC‑20 tokens (`TokenA`, `TokenB`)  
- A core AMM contract (`SimpleSwap.sol`)  
- Full Hardhat setup with tests and coverage  
- A Next.js front‑end for easy user interaction  

---

## Prerequisites

- Node.js v16+  
- npm or Yarn  
- Hardhat  
- MetaMask or any EIP‑1193 compatible wallet  

---

## Installation

```bash
git clone https://github.com/Walter185/TP4-Scaffold
cd scaffold-tp4

# Install root dependencies (if using a monorepo)
npm install

# Contracts (Hardhat)
cd packages/hardhat
npm install

# Front‑end (Next.js)
cd ../nextjs
npm install
```

---

## Environment Configuration

### Hardhat (`packages/hardhat/.env`)

```ini
SEPOLIA_RPC_URL=<Your Sepolia RPC URL>
PRIVATE_KEY=<Your Deployer Private Key>
ETHERSCAN_API_KEY=<Your Etherscan API Key>
```

### Next.js (`packages/nextjs/.env.local`)

```ini
NEXT_PUBLIC_PROVIDER=<RPC URL (localhost or Sepolia)>
NEXT_PUBLIC_SWAP_ADDRESS=<Deployed SimpleSwap Address>
NEXT_PUBLIC_TOKENA_ADDRESS=<Deployed TokenA Address>
NEXT_PUBLIC_TOKENB_ADDRESS=<Deployed TokenB Address>
```

---

## Smart Contracts

### TokenA.sol

```solidity
/// @title TokenA
/// @notice ERC‑20 token used as the first asset in the AMM
contract TokenA is ERC20, Ownable {
    /// @param initialOwner The address that can mint new tokens
    constructor(address initialOwner) ERC20("TokenA","TKA") Ownable(initialOwner) {}

    /// @notice Mint new tokens
    /// @param to Recipient address
    /// @param amount Number of tokens to mint (in wei)
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

### TokenB.sol

```solidity
/// @title TokenB
/// @notice ERC‑20 token used as the second asset in the AMM
contract TokenB is ERC20, Ownable {
    constructor(address initialOwner) ERC20("TokenB","TKB") Ownable(initialOwner) {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

### SimpleSwap.sol

```solidity
/// @title SimpleSwap
/// @notice Automated Market Maker (AMM) enabling swaps and liquidity provision
contract SimpleSwap is ERC20 {
    /// @notice Address of TokenA
    address public tokenA;
    /// @notice Address of TokenB
    address public tokenB;
    /// @notice AMM reserves
    uint public reserveA;
    uint public reserveB;

    /// @notice Emitted when liquidity is added
    event LiquidityAdded(uint amountA, uint amountB, uint liquidity);

    /// @param _tokenA Address of TokenA
    /// @param _tokenB Address of TokenB
    constructor(address _tokenA, address _tokenB) ERC20("LiquidityToken","LQT") {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    /// @notice Add equal-value liquidity to the pool
    /// @dev Requires prior ERC‑20 `approve`
    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity) { /* ... */ }

    /// @notice Remove liquidity and receive underlying tokens
    function removeLiquidity(
        address _tokenA, address _tokenB,
        uint liquidity, uint amountAMin, uint amountBMin,
        address to, uint deadline
    ) external returns (uint amountA, uint amountB) { /* ... */ }

    /// @notice Swap tokens given exact input amount
    function swapExactTokensForTokens(
        uint amountIn, uint amountOutMin,
        address[] calldata path, address to, uint deadline
    ) external { /* ... */ }

    /// @notice Get current price (scaled by 1e18)
    function getPrice(address _tokenA, address _tokenB) external view returns (uint price) { /* ... */ }

    /// @notice AMM formula for output amount
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint amountOut) { /* ... */ }
}
```

---

## Deployment

### Local Network

```bash
cd packages/hardhat
npx hardhat node
npx hardhat deploy --network localhost
```

### Sepolia Testnet

```bash
npx hardhat deploy --network sepolia
```

---

## Testing & Coverage

```bash
cd packages/hardhat
npx hardhat test
npx hardhat coverage
```

Coverage report available under `packages/hardhat/coverage/index.html`.

---

## Front‑End Application

```bash
cd packages/nextjs
npm run dev
```

Features:
- MetaMask integration  
- Real-time balances  
- Price lookup  
- Token approvals & swaps  

---

## Verification on Etherscan

```bash
npx hardhat verify --network sepolia   --contract contracts/TokenA.sol:TokenA <TokenA_Address> <Deployer>

npx hardhat verify --network sepolia   --contract contracts/TokenB.sol:TokenB <TokenB_Address> <Deployer>

npx hardhat verify --network sepolia   --contract contracts/SimpleSwap.sol:SimpleSwap <Swap_Address> <TokenA_Address> <TokenB_Address>
```

---

## Usage

1. Connect MetaMask  
2. View balances & price  
3. Enter an amount & swap  
4. (Future) Add/remove liquidity via UI  

---

## Contributing

Pull requests welcome. Please adhere to coding standards and add tests for new features.

---

## License

MIT License © Walter Liendo
