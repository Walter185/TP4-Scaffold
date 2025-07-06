import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const func: DeployFunction = async function ({ deployments, getNamedAccounts }) {
  const { get } = deployments;
  const { deployer } = await getNamedAccounts();

  const signer = await ethers.getSigner(deployer);

  const tokenADeployment = await get("TokenA");
  const tokenBDeployment = await get("TokenB");
  const swapDeployment = await get("SimpleSwap");

  const tokenA = await ethers.getContractAt("TokenA", tokenADeployment.address, signer);
  const tokenB = await ethers.getContractAt("TokenB", tokenBDeployment.address, signer);
  const simpleSwap = await ethers.getContractAt("SimpleSwap", swapDeployment.address, signer);

  const amountA = ethers.utils.parseUnits("1000", 18);
  const amountB = ethers.utils.parseUnits("1000", 18);
  const amountAMin = ethers.utils.parseUnits("900", 18);
  const amountBMin = ethers.utils.parseUnits("900", 18);
  const deadline = Math.floor(Date.now() / 1000) + 600;

  console.log("Minting tokens...");
  await tokenA.mint(deployer, amountA);
  await tokenB.mint(deployer, amountB);

  console.log("Approving...");
  await tokenA.approve(simpleSwap.address, amountA);
  await tokenB.approve(simpleSwap.address, amountB);

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
  );
  await tx.wait();

  console.log("✅ Liquidez añadida");
};

export default func;
func.tags = ["AddLiquidity"];
