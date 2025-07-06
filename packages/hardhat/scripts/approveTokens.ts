// approveTokens.ts
import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();

  const tokenA = await ethers.getContractAt("ERC20", "0x37C6B46eCA55cFD97D28707490bCE944911a33c3", signer);
  const tokenB = await ethers.getContractAt("ERC20", "0x4c06E3BdDF0e87f993287A5744Bc63Fc1282e613", signer);
  const simpleSwapAddress = "0x37cd582b320b78c4B23d7d50eA2cB11426694dF9";

  const amount = ethers.utils.parseUnits("1000", 18);

  console.log("Approving TokenA...");
  const tx1 = await tokenA.approve(simpleSwapAddress, amount);
  await tx1.wait();
  console.log("✅ TokenA approved");

  console.log("Approving TokenB...");
  const tx2 = await tokenB.approve(simpleSwapAddress, amount);
  await tx2.wait();
  console.log("✅ TokenB approved");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
