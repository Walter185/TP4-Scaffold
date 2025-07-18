// 03_add_liquidity.ts
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const addInitialLiquidity: DeployFunction = async function ({ deployments, getNamedAccounts }) {
  const { get } = deployments;
  const { deployer } = await getNamedAccounts();

  // Retrieve deployments
  const tokenADeployment = await get("TokenA");
  const tokenBDeployment = await get("TokenB");
  const swapDeployment   = await get("SimpleSwap");

  // Instantiate contracts with signer
  const signer = await ethers.getSigner(deployer);
  const tokenA = await ethers.getContractAt("TokenA", tokenADeployment.address, signer);
  const tokenB = await ethers.getContractAt("TokenB", tokenBDeployment.address, signer);
  const simpleSwap = await ethers.getContractAt("SimpleSwap", swapDeployment.address, signer);

  // Parameters
  const amountA    = ethers.utils.parseUnits("1000", 18);
  const amountB    = ethers.utils.parseUnits("1000", 18);
  const amountAMin = ethers.utils.parseUnits("100", 18);
  const amountBMin = ethers.utils.parseUnits("100", 18);
  const deadline   = Math.floor(Date.now() / 1000) + 600;

  console.log("🧾 Deployer:", deployer);
  console.log("🔹 TokenA deployed at:", tokenA.address);
  console.log("🔸 TokenB deployed at:", tokenB.address);
  console.log("💧 SimpleSwap deployed at:", simpleSwap.address);

  // Validate pair
  const [expectedA, expectedB] = await Promise.all([
    simpleSwap.tokenA(),
    simpleSwap.tokenB()
  ]);
  if (tokenA.address !== expectedA || tokenB.address !== expectedB) {
    throw new Error("❌ Token addresses do not match SimpleSwap pair.");
  }

  console.log("Minting tokens...");
  await (await tokenA.mint(deployer, amountA)).wait();
  await (await tokenB.mint(deployer, amountB)).wait();

  console.log("Approving allowances...");
  await (await tokenA.approve(simpleSwap.address, amountA)).wait();
  await (await tokenB.approve(simpleSwap.address, amountB)).wait();

  const [balanceA, balanceB, allowanceA, allowanceB] = await Promise.all([
    tokenA.balanceOf(deployer),
    tokenB.balanceOf(deployer),
    tokenA.allowance(deployer, simpleSwap.address),
    tokenB.allowance(deployer, simpleSwap.address)
  ]);
  console.log("Balance A:", balanceA.toString());
  console.log("Balance B:", balanceB.toString());
  console.log("Allowance A:", allowanceA.toString());
  console.log("Allowance B:", allowanceB.toString());

  console.log("Adding liquidity...");
  const tx = await simpleSwap.addLiquidity(
    tokenA.address,
    tokenB.address,
    amountA,
    amountB,
    amountAMin,
    amountBMin,
    deployer,
    deadline,
    { gasLimit: 1000000 }
  );
  await tx.wait();

  console.log("✅ Liquidity added successfully");
};

export default addInitialLiquidity;
addInitialLiquidity.tags = ["AddLiquidity"];