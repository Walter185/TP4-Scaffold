import { ethers } from "hardhat";
import { expect } from "chai";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

describe("SimpleSwap", function () {
  let tokenA: any;
  let tokenB: any;
  let simpleSwap: any;
  let owner: any;
  let user: any;
  let ownerAddr: string;
  let userAddr: string;

  // Helper to get deadline offset
  async function getDeadline(offset: number): Promise<number> {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp + offset;
  }

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    ownerAddr = await owner.getAddress();
    userAddr = await user.getAddress();

    const TokenA = await ethers.getContractFactory("TokenA");
    tokenA = await TokenA.deploy(ownerAddr);
    await tokenA.deployed();
    const TokenB = await ethers.getContractFactory("TokenB");
    tokenB = await TokenB.deploy(ownerAddr);
    await tokenB.deployed();
    const Swap = await ethers.getContractFactory("SimpleSwap");
    simpleSwap = await Swap.deploy(tokenA.address, tokenB.address);
    await simpleSwap.deployed();

    // Mint initial tokens
    await tokenA.mint(ownerAddr, ethers.utils.parseEther("1000"));
    await tokenB.mint(ownerAddr, ethers.utils.parseEther("1000"));
  });

  it("returns correct token addresses", async function () {
    expect(await simpleSwap.tokenA()).to.equal(tokenA.address);
    expect(await simpleSwap.tokenB()).to.equal(tokenB.address);
  });

  it("reverts on addLiquidity with invalid pair", async function () {
    const wrong = ethers.Wallet.createRandom().address;
    const dl = await getDeadline(3600);
    await expect(
      simpleSwap.addLiquidity(
        wrong,
        tokenB.address,
        ethers.utils.parseEther("1"),
        ethers.utils.parseEther("1"),
        0,
        0,
        ownerAddr,
        dl
      )
    ).to.be.rejectedWith("SimpleSwap: invalid pair");
  });

  it("reverts on addLiquidity with expired deadline", async function () {
    await tokenA.approve(simpleSwap.address, ethers.utils.parseEther("1"));
    await tokenB.approve(simpleSwap.address, ethers.utils.parseEther("1"));
    const expired = await getDeadline(-10);
    await expect(
      simpleSwap.addLiquidity(
        tokenA.address,
        tokenB.address,
        ethers.utils.parseEther("1"),
        ethers.utils.parseEther("1"),
        0,
        0,
        ownerAddr,
        expired
      )
    ).to.be.rejectedWith("SimpleSwap: expired");
  });

    it("adds and removes liquidity correctly", async function () {
    const amount = ethers.utils.parseEther("500");
    const dl = await getDeadline(3600);
    await tokenA.approve(simpleSwap.address, amount);
    await tokenB.approve(simpleSwap.address, amount);
    await simpleSwap.addLiquidity(
      tokenA.address,
      tokenB.address,
      amount,
      amount,
      amount.mul(90).div(100),
      amount.mul(90).div(100),
      ownerAddr,
      dl
    );
    const balanceLiq = await simpleSwap.balanceOf(ownerAddr);
    // Ensure balanceLiq is a BigNumber greater than zero
    expect(balanceLiq.gt(ethers.BigNumber.from(0))).to.be.true;    

    // Remove partial liquidity
    const half = balanceLiq.div(2);
    await simpleSwap.removeLiquidity(
      tokenA.address,
      tokenB.address,
      half,
      0,
      0,
      ownerAddr,
      dl
    );
    const after = await simpleSwap.balanceOf(ownerAddr);
    expect(after.eq(balanceLiq.sub(half))).to.be.true; // Correct removal balance check
  });

  it("reverts removeLiquidity with slippage or invalid pair", async function () {
    const dl = await getDeadline(3600);
    await expect(
      simpleSwap.removeLiquidity(
        tokenA.address,
        tokenB.address,
        ethers.BigNumber.from(1),
        ethers.utils.parseEther("1"),
        0,
        ownerAddr,
        dl
      )
    ).to.be.rejected;
    const wrong = ethers.Wallet.createRandom().address;
    await expect(
      simpleSwap.removeLiquidity(
        wrong,
        tokenB.address,
        0,
        0,
        0,
        ownerAddr,
        dl
      )
    ).to.be.rejectedWith("SimpleSwap: invalid pair");
  });

  it("swaps tokens correctly and enforces path and slippage", async function () {
    const addAmt = ethers.utils.parseEther("100");
    const swapAmt = ethers.utils.parseEther("10");
    const dl = await getDeadline(3600);
    await tokenA.approve(simpleSwap.address, addAmt);
    await tokenB.approve(simpleSwap.address, addAmt);
    await simpleSwap.addLiquidity(
      tokenA.address,
      tokenB.address,
      addAmt,
      addAmt,
      0,
      0,
      ownerAddr,
      dl
    );
    await tokenA.transfer(userAddr, swapAmt);
    await tokenA.connect(user).approve(simpleSwap.address, swapAmt);
    const before = await tokenB.balanceOf(userAddr);
    await simpleSwap.connect(user).swapExactTokensForTokens(
      swapAmt,
      ethers.BigNumber.from(0),
      [tokenA.address, tokenB.address],
      userAddr,
      dl
    );
    const after = await tokenB.balanceOf(userAddr);
    expect(after.gt(before)).to.be.true;

    // Invalid path
    await expect(
      simpleSwap.swapExactTokensForTokens(
        swapAmt,
        0,
        [tokenA.address],
        ownerAddr,
        dl
      )
    ).to.be.rejectedWith("SimpleSwap: invalid path");
    // Expired deadline
    const expired = await getDeadline(-1);
    await expect(
      simpleSwap.swapExactTokensForTokens(
        swapAmt,
        0,
        [tokenA.address, tokenB.address],
        ownerAddr,
        expired
      )
    ).to.be.rejectedWith("SimpleSwap: expired");
  });

    it("calculates price and amountOut accurately", async function () {
    const addA = ethers.utils.parseEther("100");
    const addB = ethers.utils.parseEther("50");
    const dl = await getDeadline(3600);
    await tokenA.approve(simpleSwap.address, addA);
    await tokenB.approve(simpleSwap.address, addB);
    await simpleSwap.addLiquidity(
      tokenA.address,
      tokenB.address,
      addA,
      addB,
      0,
      0,
      ownerAddr,
      dl
    );
    const price = await simpleSwap.getPrice(tokenA.address, tokenB.address);
    // Price should be greater than zero
    expect(price.gt(ethers.constants.Zero)).to.be.true;

    const amountOut = await simpleSwap.getAmountOut(
      ethers.utils.parseEther("10"),
      addA,
      addB
    );
    // amountOut should be greater than zero
    expect(amountOut.gt(ethers.constants.Zero)).to.be.true;

    // invalid input reverts
    await expect(
      simpleSwap.getAmountOut(0, 0, 0)
    ).to.be.rejectedWith("SimpleSwap: invalid input");
  });
});
