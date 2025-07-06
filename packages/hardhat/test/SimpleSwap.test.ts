import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";

describe("SimpleSwap", () => {
  let tokenA: Contract;
  let tokenB: Contract;
  let simpleSwap: Contract;
  let owner: any;
  let user: any;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();

    const TokenA = await ethers.getContractFactory("TokenA");
    const TokenB = await ethers.getContractFactory("TokenB");
    const SimpleSwap = await ethers.getContractFactory("SimpleSwap");

    tokenA = await TokenA.deploy(owner.address);
    tokenB = await TokenB.deploy(owner.address);

    await tokenA.mint(owner.address, ethers.utils.parseEther("1000"));
    await tokenB.mint(owner.address, ethers.utils.parseEther("1000"));

    simpleSwap = await SimpleSwap.deploy(tokenA.address, tokenB.address);

    // Aprobar el contrato para transferencias
    await tokenA.approve(simpleSwap.address, ethers.utils.parseEther("500"));
    await tokenB.approve(simpleSwap.address, ethers.utils.parseEther("500"));
  });

  it("should add liquidity", async () => {
    const deadline = (await ethers.provider.getBlock("latest")).timestamp + 1000;

    const tx = await simpleSwap.addLiquidity(
      tokenA.address,
      tokenB.address,
      ethers.utils.parseEther("100"),
      ethers.utils.parseEther("100"),
      0,
      0,
      owner.address,
      deadline,
    );
    await tx.wait();

    const balance = await simpleSwap.balanceOf(owner.address);
    expect(balance).to.be.gt(0);

    const reserves = await simpleSwap.getReserves();
    expect(reserves[0]).to.equal(ethers.utils.parseEther("100"));
    expect(reserves[1]).to.equal(ethers.utils.parseEther("100"));
  });

  it("should swap tokenA for tokenB", async () => {
    const deadline = (await ethers.provider.getBlock("latest")).timestamp + 1000;

    // Añadir liquidez primero
    await simpleSwap.addLiquidity(
      tokenA.address,
      tokenB.address,
      ethers.utils.parseEther("100"),
      ethers.utils.parseEther("100"),
      0,
      0,
      owner.address,
      deadline,
    );

    // Transferir tokens a user y aprobar
    await tokenA.transfer(user.address, ethers.utils.parseEther("10"));
    await tokenA.connect(user).approve(simpleSwap.address, ethers.utils.parseEther("10"));

    const path = [tokenA.address, tokenB.address];
    await simpleSwap
      .connect(user)
      .swapExactTokensForTokens(ethers.utils.parseEther("5"), 0, path, user.address, deadline);

    const userBalanceB = await tokenB.balanceOf(user.address);
    expect(userBalanceB).to.be.gt(0);
  });

  it("should fail to swap with expired deadline", async () => {
    const deadline = (await ethers.provider.getBlock("latest")).timestamp - 1;

    const path = [tokenA.address, tokenB.address];

    await expect(
      simpleSwap.swapExactTokensForTokens(ethers.utils.parseEther("1"), 0, path, owner.address, deadline),
    ).to.be.revertedWith("Deadline expired");
  });

  it("should remove liquidity", async () => {
    const deadline = (await ethers.provider.getBlock("latest")).timestamp + 1000;

    await simpleSwap.addLiquidity(
      tokenA.address,
      tokenB.address,
      ethers.utils.parseEther("100"),
      ethers.utils.parseEther("100"),
      0,
      0,
      owner.address,
      deadline,
    );

    const liquidity = await simpleSwap.balanceOf(owner.address);

    await tokenA.approve(simpleSwap.address, ethers.utils.parseEther("1000"));
    await tokenB.approve(simpleSwap.address, ethers.utils.parseEther("1000"));
    await simpleSwap.approve(simpleSwap.address, liquidity);

    const tx = await simpleSwap.removeLiquidity(
      tokenA.address,
      tokenB.address,
      liquidity,
      0,
      0,
      owner.address,
      deadline,
    );
    await tx.wait();

    const remaining = await simpleSwap.balanceOf(owner.address);
    expect(remaining).to.equal(0);
  });

  it("should return correct price", async () => {
    const deadline = (await ethers.provider.getBlock("latest")).timestamp + 1000;

    await simpleSwap.addLiquidity(
      tokenA.address,
      tokenB.address,
      ethers.utils.parseEther("100"),
      ethers.utils.parseEther("50"),
      0,
      0,
      owner.address,
      deadline,
    );

    const price = await simpleSwap.getPrice(tokenA.address, tokenB.address);
    expect(price).to.be.gt(0);
  });
});
