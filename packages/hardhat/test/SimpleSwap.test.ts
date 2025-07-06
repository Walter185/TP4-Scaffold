import { expect } from "chai";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import { Contract } from "ethers";

describe("SimpleSwap", function () {
  let tokenA: Contract;
  let tokenB: Contract;
  let simpleSwap: Contract;
  let deployer: string;

  beforeEach(async function () {
    await deployments.fixture(); // Ejecuta todos los deploys

    const { deployer: deployerAddr } = await getNamedAccounts();
    deployer = deployerAddr;

    tokenA = await ethers.getContractAt("TokenA", (await deployments.get("TokenA")).address);
    tokenB = await ethers.getContractAt("TokenB", (await deployments.get("TokenB")).address);
    simpleSwap = await ethers.getContractAt("SimpleSwap", (await deployments.get("SimpleSwap")).address);

    const amount = ethers.utils.parseEther("1000");

    await tokenA.mint(deployer, amount);
    await tokenB.mint(deployer, amount);

    await tokenA.approve(simpleSwap.address, amount);
    await tokenB.approve(simpleSwap.address, amount);
  });

  it("should add liquidity", async function () {
    const amountA = ethers.utils.parseEther("100");
    const amountB = ethers.utils.parseEther("100");
    const amountAMin = ethers.utils.parseEther("90");
    const amountBMin = ethers.utils.parseEther("90");
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    await expect(
      simpleSwap.addLiquidity(
        tokenA.address,
        tokenB.address,
        amountA,
        amountB,
        amountAMin,
        amountBMin,
        deployer,
        deadline,
      ),
    ).to.emit(simpleSwap, "LiquidityAdded");

    const reserves = await simpleSwap.getReserves();
    expect(reserves[0]).to.equal(amountA);
    expect(reserves[1]).to.equal(amountB);
  });

  it("should swap tokenA for tokenB", async function () {
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
    const amountA = ethers.utils.parseEther("100");
    const amountB = ethers.utils.parseEther("100");

    // Agrega liquidez
    await simpleSwap.addLiquidity(
      tokenA.address,
      tokenB.address,
      amountA,
      amountB,
      ethers.utils.parseEther("90"),
      ethers.utils.parseEther("90"),
      deployer,
      deadline,
    );

    // Muestra balances iniciales
    const initialB = await tokenB.balanceOf(deployer);

    // Swapea
    await tokenA.approve(simpleSwap.address, ethers.utils.parseEther("10"));
    await simpleSwap.swapExactTokensForTokens(
      tokenA.address,
      tokenB.address,
      ethers.utils.parseEther("10"),
      ethers.utils.parseEther("8"),
      deployer,
      deadline,
    );

    const finalB = await tokenB.balanceOf(deployer);
    expect(finalB).to.be.gt(initialB);
  });
});
