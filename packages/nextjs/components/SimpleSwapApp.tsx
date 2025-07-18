"use client";

import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";

const SIMPLE_SWAP_ADDRESS = process.env.NEXT_PUBLIC_SWAP_ADDRESS!;
const TOKEN_A_ADDRESS = process.env.NEXT_PUBLIC_TOKENA_ADDRESS!;
const TOKEN_B_ADDRESS = process.env.NEXT_PUBLIC_TOKENB_ADDRESS!;

const abiSimpleSwap = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external",
  "function getPrice(address _tokenA, address _tokenB) external view returns (uint)",
];

const abiERC20 = [
  "function approve(address spender, uint amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint)",
  "function decimals() view returns (uint8)",
];

export default function SimpleSwapApp() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string>("");

  const [amount, setAmount] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [isReversed, setIsReversed] = useState(false);
  const [balanceA, setBalanceA] = useState("0");
  const [balanceB, setBalanceB] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize provider & signer once
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const prov = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(prov);
      setSigner(prov.getSigner());

      // Request accounts on load
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts: string[]) => {
          if (accounts[0]) setAccount(accounts[0]);
        })
        .catch(() => {
          /* no-op */
        });

      // Listen for account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount("");
        }
      };
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  // Fetch balances whenever provider or account change
  const fetchBalances = useCallback(async () => {
    if (!provider || !account) return;
    try {
      const tokenA = new ethers.Contract(TOKEN_A_ADDRESS, abiERC20, provider);
      const tokenB = new ethers.Contract(TOKEN_B_ADDRESS, abiERC20, provider);
      const [rawA, rawB, dec] = await Promise.all([
        tokenA.balanceOf(account),
        tokenB.balanceOf(account),
        tokenA.decimals(),
      ]);
      setBalanceA(ethers.utils.formatUnits(rawA, dec));
      setBalanceB(ethers.utils.formatUnits(rawB, dec));
    } catch (e) {
      console.error(e);
    }
  }, [provider, account]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  // Auto‐dismiss error toasts
  useEffect(() => {
    if (!error) return;
    const h = setTimeout(() => setError(null), 5_000);
    return () => clearTimeout(h);
  }, [error]);

  const getTokenPrice = async () => {
    if (!provider) return;
    try {
      const swap = new ethers.Contract(SIMPLE_SWAP_ADDRESS, abiSimpleSwap, provider);
      const raw = await swap.getPrice(
        isReversed ? TOKEN_B_ADDRESS : TOKEN_A_ADDRESS,
        isReversed ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS,
      );
      setPrice(ethers.utils.formatUnits(raw, 18));
    } catch {
      setError("❌ No se pudo obtener el precio");
    }
  };

  const swapTokens = async () => {
    if (!signer || !amount) return;
    setError(null);
    setLoading(true);
    try {
      const amt = ethers.utils.parseUnits(amount, 18);
      const fromToken = isReversed ? TOKEN_B_ADDRESS : TOKEN_A_ADDRESS;
      // approve
      const tok = new ethers.Contract(fromToken, abiERC20, signer);
      await (await tok.approve(SIMPLE_SWAP_ADDRESS, amt)).wait();
      // swap
      const swap = new ethers.Contract(SIMPLE_SWAP_ADDRESS, abiSimpleSwap, signer);
      const dl = Math.floor(Date.now() / 1000) + 600;
      await (
        await swap.swapExactTokensForTokens(
          amt,
          0,
          isReversed ? [TOKEN_B_ADDRESS, TOKEN_A_ADDRESS] : [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS],
          account,
          dl,
        )
      ).wait();
      // refrescar balances
      await fetchBalances();
      setAmount("");
    } catch (e: any) {
      setError("❌ Swap fallido: " + (e.message || e));
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
      {/* Toast errores */}
      <div className="fixed top-4 right-4 z-50">
        {error && (
          <div className="alert alert-error shadow-lg dark:bg-red-700 dark:text-red-100">
            <div>{error}</div>
          </div>
        )}
      </div>

      {/* Título */}
      <h2 className="text-2xl md:text-3xl font-bold text-center bg-blue-500 text-white py-4 rounded mb-4">
        &nbsp;&nbsp;Welcome to SimpleSwap DApp&nbsp;&nbsp;
      </h2>

      {/* Aviso conectar */}
      {!account && (
        <div className="mb-4 text-center">
          <span className="inline-block bg-yellow-700 text-yellow-100 px-4 py-2 rounded">
            ▶️ Connect your wallet to see the updated balances.
          </span>
        </div>
      )}

      {/* Balances */}
      <div className="flex justify-center space-x-12 mb-6">
        <div className="flex flex-col items-center">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Balance A</p>
          <p className="text-xl font-mono text-gray-900 dark:text-gray-200">{(parseFloat(balanceA) || 0).toFixed(2)}</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Balance B</p>
          <p className="text-xl font-mono text-gray-900 dark:text-gray-200">{(parseFloat(balanceB) || 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Controles */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setIsReversed(!isReversed)}
          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold py-2 rounded"
        >
          Switch {isReversed ? "B→A" : "A→B"}
        </button>
        <button
          onClick={getTokenPrice}
          className="flex-1 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Get Price
        </button>
      </div>

      {/* Precio */}
      {price && (
        <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-3 rounded mb-4 text-center font-mono">
          1 {isReversed ? "B" : "A"} = {parseFloat(price).toFixed(6)} {isReversed ? "A" : "B"}
        </div>
      )}

      {/* Input & Swap */}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
        disabled={!account}
      />
      <button
        onClick={swapTokens}
        disabled={!account || loading}
        className="w-full bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-2 rounded disabled:opacity-50"
      >
        {loading ? "Swapping..." : `Swap ${isReversed ? "B→A" : "A→B"}`}
      </button>
    </div>
  );
}
