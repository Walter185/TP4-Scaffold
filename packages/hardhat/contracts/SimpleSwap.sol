// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleSwap is ERC20 {
    address public tokenA;
    address public tokenB;

    uint public reserveA;
    uint public reserveB;

    event LiquidityAdded(uint amountA, uint amountB, uint liquidity);

    constructor(address _tokenA, address _tokenB) ERC20("SimpleSwapLiquidityToken", "SSLT") {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity) {
        require(block.timestamp <= deadline, "Deadline expired");
        require(_tokenA == tokenA && _tokenB == tokenB, "Invalid pair");

        IERC20(tokenA).transferFrom(msg.sender, address(this), amountADesired);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountBDesired);

        amountA = amountADesired;
        amountB = amountBDesired;

        require(amountA >= amountAMin && amountB >= amountBMin, "Slippage");

        liquidity = sqrt(amountA * amountB);
        _mint(to, liquidity);

        reserveA += amountA;
        reserveB += amountB;

        emit LiquidityAdded(amountA, amountB, liquidity);
    }

    function removeLiquidity(
        address _tokenA,
        address _tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB) {
        require(block.timestamp <= deadline, "Deadline expired");
        require(_tokenA == tokenA && _tokenB == tokenB, "Invalid pair");

        uint totalLiq = totalSupply();
        amountA = (liquidity * reserveA) / totalLiq;
        amountB = (liquidity * reserveB) / totalLiq;

        require(amountA >= amountAMin && amountB >= amountBMin, "Slippage");

        _burn(msg.sender, liquidity);

        IERC20(tokenA).transfer(to, amountA);
        IERC20(tokenB).transfer(to, amountB);

        reserveA -= amountA;
        reserveB -= amountB;
    }

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external {
        require(block.timestamp <= deadline, "Deadline expired");
        require(path.length == 2, "Invalid path");
        address fromToken = path[0];
        address toToken = path[1];
        require((fromToken == tokenA && toToken == tokenB) || (fromToken == tokenB && toToken == tokenA), "Invalid pair");

        IERC20(fromToken).transferFrom(msg.sender, address(this), amountIn);

        uint reserveIn = fromToken == tokenA ? reserveA : reserveB;
        uint reserveOut = toToken == tokenA ? reserveA : reserveB;

        uint amountOut = getAmountOut(amountIn, reserveIn, reserveOut);
        require(amountOut >= amountOutMin, "Slippage");

        IERC20(toToken).transfer(to, amountOut);

        if (fromToken == tokenA) {
            reserveA += amountIn;
            reserveB -= amountOut;
        } else {
            reserveB += amountIn;
            reserveA -= amountOut;
        }
    }

    function getPrice(address _tokenA, address _tokenB) external view returns (uint price) {
        require((_tokenA == tokenA && _tokenB == tokenB) || (_tokenA == tokenB && _tokenB == tokenA), "Invalid pair");
        if (_tokenA == tokenA) {
            price = (reserveB * 1e18) / reserveA;
        } else {
            price = (reserveA * 1e18) / reserveB;
        }
    }

    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint amountOut) {
        require(amountIn > 0 && reserveIn > 0 && reserveOut > 0, "Invalid input");
        uint amountInWithFee = amountIn * 997;
        uint numerator = amountInWithFee * reserveOut;
        uint denominator = (reserveIn * 1000) + amountInWithFee;
        amountOut = numerator / denominator;
    }

    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}
