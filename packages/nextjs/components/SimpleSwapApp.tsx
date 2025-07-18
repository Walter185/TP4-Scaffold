"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

const SIMPLE_SWAP_ADDRESS = process.env.NEXT_PUBLIC_SWAP_ADDRESS!;
const TOKEN_A_ADDRESS = process.env.NEXT_PUBLIC_TOKENA_ADDRESS!;
const TOKEN_B_ADDRESS = process.env.NEXT_PUBLIC_TOKENB_ADDRESS!;

const abiSimpleSwap = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external",
  "function getPrice(address _tokenA, address _tokenB) external view returns (uint)"
];

const abiERC20 = [
  "function approve(address spender, uint amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint)",
  "function decimals() view returns (uint8)"
];

export default function SimpleSwapApp() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string>("");

  const [amount, setAmount] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [isReversed, setIsReversed] = useState<boolean>(false);
  const [balanceA, setBalanceA] = useState<string>("0");
  const [balanceB, setBalanceB] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize provider and signer
  useEffect(() => {
    if (window.ethereum) {
      const prov = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(prov);
      prov.send("eth_requestAccounts", []).then(() => {
        const s = prov.getSigner();
        setSigner(s);
        s.getAddress().then((addr) => setAccount(addr));
      });
    }
  }, []);

  // Fetch balances
  useEffect(() => {
    const fetchBalances = async () => {
      if (!provider || !account) return;
      try {
        const tokenA = new ethers.Contract(TOKEN_A_ADDRESS, abiERC20, provider);
        const tokenB = new ethers.Contract(TOKEN_B_ADDRESS, abiERC20, provider);
        const [rawA, rawB] = await Promise.all([
          tokenA.balanceOf(account),
          tokenB.balanceOf(account)
        ]);
        const dec = await tokenA.decimals();
        setBalanceA(ethers.utils.formatUnits(rawA, dec));
        setBalanceB(ethers.utils.formatUnits(rawB, dec));
      } catch (e) {
        console.error(e);
      }
    };
    fetchBalances();
  }, [provider, account]);

  const getTokenPrice = async () => {
    if (!provider) return;
    try {
      const swap = new ethers.Contract(SIMPLE_SWAP_ADDRESS, abiSimpleSwap, provider);
      const result = await swap.getPrice(
        isReversed ? TOKEN_B_ADDRESS : TOKEN_A_ADDRESS,
        isReversed ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS
      );
      setPrice(ethers.utils.formatUnits(result, 18));
    } catch (e) {
      console.error(e);
      setError("Failed to fetch price");
    }
  };

  const swapTokens = async () => {
    if (!signer || !amount) return;
    setError(null);
    setLoading(true);
    try {
      const amt = ethers.utils.parseUnits(amount, 18);
      // Approve
      const tokenContract = new ethers.Contract(
        isReversed ? TOKEN_B_ADDRESS : TOKEN_A_ADDRESS,
        abiERC20,
        signer
      );
      await (await tokenContract.approve(SIMPLE_SWAP_ADDRESS, amt)).wait();

      // Swap
      const swap = new ethers.Contract(SIMPLE_SWAP_ADDRESS, abiSimpleSwap, signer);
      const deadline = Math.floor(Date.now() / 1000) + 600;
      await (await swap.swapExactTokensForTokens(
        amt,
        0,
        isReversed
          ? [TOKEN_B_ADDRESS, TOKEN_A_ADDRESS]
          : [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS],
        account,
        deadline
      )).wait();

      // Refresh balances
      const tokenA = new ethers.Contract(TOKEN_A_ADDRESS, abiERC20, provider!);
      const tokenB = new ethers.Contract(TOKEN_B_ADDRESS, abiERC20, provider!);
      const [rawA, rawB] = await Promise.all([
        tokenA.balanceOf(account),
        tokenB.balanceOf(account)
      ]);
      const dec = await tokenA.decimals();
      setBalanceA(ethers.utils.formatUnits(rawA, dec));
      setBalanceB(ethers.utils.formatUnits(rawB, dec));

      setAmount("");
    } catch (e) {
      console.error(e);
      setError("Swap failed");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold text-center bg-blue-500 text-white py-2 rounded">
        SimpleSwap DApp
      </h2>

      <div className="flex justify-between my-4" style={{color:"black"}}>
        <div>
          <p className="text-sm font-medium">Balance A</p>
          <p className="text-lg">{balanceA}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Balance B</p>
          <p className="text-lg">{balanceB}</p>
        </div>
      </div>

      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setIsReversed(!isReversed)}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded"
        >
          Switch {isReversed ? 'B→A' : 'A→B'}
        </button>
        <button
          onClick={getTokenPrice}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
        >
          Get Price
        </button>
      </div>

      {price && (
        <div className="bg-blue-100 text-blue-800 p-3 rounded mb-4 text-center">
          1 {isReversed ? 'B' : 'A'} = {price} {isReversed ? 'A' : 'B'}
        </div>
      )}

      <div className="mb-4">
        <input
          type="number"
          style={{color:"black"}}
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        onClick={swapTokens}
        disabled={loading}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Swapping...' : `Swap ${isReversed ? 'B→A' : 'A→B'}`}
      </button>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
}
