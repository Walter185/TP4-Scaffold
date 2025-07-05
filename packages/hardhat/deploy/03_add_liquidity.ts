import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { get } = deployments;

  const signer = await ethers.getSigner(deployer);

  const tokenADeployment = await get("TokenA");
  const tokenBDeployment = await get("TokenB");
  const swapDeployment = await get("SimpleSwap");

  const tokenA = await ethers.getContractAt("TokenA", tokenADeployment.address, signer);
  const tokenB = await ethers.getContractAt("TokenB", tokenBDeployment.address, signer);
  const simpleSwap = await ethers.getContractAt("SimpleSwap", swapDeployment.address, signer);

  const amountA = ethers.parseUnits("1000", 18);
  const amountB = ethers.parseUnits("1000", 18);
  const amountAMin = ethers.parseUnits("900", 18);
  const amountBMin = ethers.parseUnits("900", 18);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutos

  console.log(`Minting tokens to ${deployer}...`);
  await tokenA.mint(deployer, amountA);
  await tokenB.mint(deployer, amountB);

  console.log("Approving tokens...");
  await tokenA.approve(simpleSwap.target, amountA);
  await tokenB.approve(simpleSwap.target, amountB);

  console.log("Adding liquidity...");
  const tx = await simpleSwap.addLiquidity(
    tokenADeployment.address,
    tokenBDeployment.address,
    amountA,
    amountB,
    amountAMin,
    amountBMin,
    deployer,
    deadline,
  );
  await tx.wait();

  console.log("✅ Liquidity added!");
};

export default func;
func.tags = ["AddLiquidity"];
