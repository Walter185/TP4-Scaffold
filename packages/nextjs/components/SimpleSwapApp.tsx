import { useEffect, useState } from "react";
import { ethers } from "ethers";

const SIMPLE_SWAP_ADDRESS = "0x37cd582b320b78c4B23d7d50eA2cB11426694dF9";
const TOKEN_A_ADDRESS = "0x37C6B46eCA55cFD97D28707490bCE944911a33c3";
const TOKEN_B_ADDRESS = "0x4c06E3BdDF0e87f993287A5744Bc63Fc1282e613";

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
  const [provider, setProvider] = useState<any>();
  const [signer, setSigner] = useState<any>();
  const [account, setAccount] = useState<string>("");
  const [amount, setAmount] = useState("0");
  const [price, setPrice] = useState("");
  const [isReversed, setIsReversed] = useState(false);
  const [balanceA, setBalanceA] = useState("0");
  const [balanceB, setBalanceB] = useState("0");

  useEffect(() => {
    if (window.ethereum) {
      const prov = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(prov);
      const signer = prov.getSigner();
      setSigner(signer);
      signer.getAddress().then((addr: string) => {
        setAccount(addr);
        fetchBalances(prov, addr);
      });
    }
  }, []);

  const fetchBalances = async (prov: any, addr: string) => {
    const tokenA = new ethers.Contract(TOKEN_A_ADDRESS, abiERC20, prov);
    const tokenB = new ethers.Contract(TOKEN_B_ADDRESS, abiERC20, prov);
    const balA = await tokenA.balanceOf(addr);
    const balB = await tokenB.balanceOf(addr);
    setBalanceA(ethers.utils.formatUnits(balA, 18));
    setBalanceB(ethers.utils.formatUnits(balB, 18));
  };

  const getTokenPrice = async () => {
    const contract = new ethers.Contract(SIMPLE_SWAP_ADDRESS, abiSimpleSwap, provider);
    const price = await contract.getPrice(
      isReversed ? TOKEN_B_ADDRESS : TOKEN_A_ADDRESS,
      isReversed ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS,
    );
    setPrice(ethers.utils.formatUnits(price, 18));
  };

  const swapTokens = async () => {
    const amountIn = ethers.utils.parseUnits(amount, 18);
    const deadline = Math.floor(Date.now() / 1000) + 600;
    const fromToken = isReversed ? TOKEN_B_ADDRESS : TOKEN_A_ADDRESS;
    const toToken = isReversed ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS;

    const tokenContract = new ethers.Contract(fromToken, abiERC20, signer);
    const approveTx = await tokenContract.approve(SIMPLE_SWAP_ADDRESS, amountIn);
    await approveTx.wait();

    const swap = new ethers.Contract(SIMPLE_SWAP_ADDRESS, abiSimpleSwap, signer);
    const tx = await swap.swapExactTokensForTokens(amountIn, 0, [fromToken, toToken], account, deadline);
    await tx.wait();
    await fetchBalances(provider, account);
    alert("✅ Swap completed");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">DApp - SimpleSwap Front-End</h2>

      <div className="flex flex-col items-center mb-4">
        <button className="bg-yellow-500 text-white px-4 py-2 rounded mb-2" onClick={() => setIsReversed(!isReversed)}>
          Switch direction: {isReversed ? "B → A" : "A → B"}
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={getTokenPrice}>
          Get price {isReversed ? "B → A" : "A → B"}
        </button>
        {price && (
          <p className="mt-2">
            1 {isReversed ? "B" : "A"} = {price} {isReversed ? "A" : "B"}
          </p>
        )}
      </div>

      <div className="text-center mb-4">
        <p>💰 Balance A: {balanceA}</p>
        <p>💰 Balance B: {balanceB}</p>
      </div>

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Amount to swap"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="border px-2 py-1 rounded mr-2"
        />
        <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={swapTokens}>
          Swap {isReversed ? "B → A" : "A → B"}
        </button>
      </div>
    </div>
  );
}
