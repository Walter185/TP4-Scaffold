// File: SimpleSwap.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title SimpleSwap DEX
/// @author Walter Liendo
/// @notice Decentralized exchange for swapping TokenA and TokenB, issuing liquidity tokens
/// @dev    Implements a simplified Uniswap V2-like mechanism without fees
contract SimpleSwap is ERC20 {
    /// @notice Address of TokenA in the pair
    address public immutable tokenA;
    /// @notice Address of TokenB in the pair
    address public immutable tokenB;
    /// @notice Current reserve of TokenA held by the contract
    uint256 public reserveA;
    /// @notice Current reserve of TokenB held by the contract
    uint256 public reserveB;

    /// @notice Emitted when liquidity is added to the pool
    /// @param amountA   Amount of TokenA added
    /// @param amountB   Amount of TokenB added
    /// @param liquidity Amount of liquidity tokens minted
    event LiquidityAdded(uint256 indexed amountA, uint256 indexed amountB, uint256 liquidity);

    /// @notice Initializes the SimpleSwap contract
    /// @param _tokenA Address of TokenA
    /// @param _tokenB Address of TokenB
    constructor(address _tokenA, address _tokenB) ERC20("SimpleSwap Liquidity Token", "SSLT") {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    /// @notice Adds liquidity to the TokenA-TokenB pool
    /// @param _tokenA        Must equal `tokenA`
    /// @param _tokenB        Must equal `tokenB`
    /// @param amountADesired Amount of TokenA to deposit
    /// @param amountBDesired Amount of TokenB to deposit
    /// @param amountAMin     Minimum amount of TokenA (slippage protection)
    /// @param amountBMin     Minimum amount of TokenB (slippage protection)
    /// @param to             Recipient of liquidity tokens
    /// @param deadline       Unix time after which transaction reverts
    /// @return amountA       Actual amount of TokenA deposited
    /// @return amountB       Actual amount of TokenB deposited
    /// @return liquidity     Amount of liquidity tokens minted
    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        require(block.timestamp <= deadline, "SimpleSwap: expired");
        require(_tokenA == tokenA && _tokenB == tokenB, "SimpleSwap: invalid pair");

        IERC20(tokenA).transferFrom(msg.sender, address(this), amountADesired);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountBDesired);

        amountA = amountADesired;
        amountB = amountBDesired;
        require(amountA >= amountAMin && amountB >= amountBMin, "SimpleSwap: slippage");

        liquidity = sqrt(amountA * amountB);
        _mint(to, liquidity);

        reserveA += amountA;
        reserveB += amountB;

        emit LiquidityAdded(amountA, amountB, liquidity);
    }

    /// @notice Removes liquidity from the TokenA-TokenB pool
    /// @param _tokenA    Must equal `tokenA`
    /// @param _tokenB    Must equal `tokenB`
    /// @param liquidity  Amount of liquidity tokens to burn
    /// @param amountAMin Minimum amount of TokenA (slippage protection)
    /// @param amountBMin Minimum amount of TokenB (slippage protection)
    /// @param to         Recipient of withdrawn tokens
    /// @param deadline   Unix time after which transaction reverts
    /// @return amountA   Amount of TokenA withdrawn
    /// @return amountB   Amount of TokenB withdrawn
    function removeLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB) {
        require(block.timestamp <= deadline, "SimpleSwap: expired");
        require(_tokenA == tokenA && _tokenB == tokenB, "SimpleSwap: invalid pair");

        uint256 totalLiq = totalSupply();
        amountA = (liquidity * reserveA) / totalLiq;
        amountB = (liquidity * reserveB) / totalLiq;
        require(amountA >= amountAMin && amountB >= amountBMin, "SimpleSwap: slippage");

        _burn(msg.sender, liquidity);
        IERC20(tokenA).transfer(to, amountA);
        IERC20(tokenB).transfer(to, amountB);

        reserveA -= amountA;
        reserveB -= amountB;
    }

    /// @notice Executes an exact-input token swap
    /// @param amountIn     Amount of input tokens to swap
    /// @param amountOutMin Minimum acceptable output tokens (slippage protection)
    /// @param path         Array [inputToken, outputToken]
    /// @param to           Recipient of output tokens
    /// @param deadline     Unix time after which transaction reverts
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external {
        require(block.timestamp <= deadline, "SimpleSwap: expired");
        require(path.length == 2, "SimpleSwap: invalid path");

        address fromToken = path[0];
        address toToken   = path[1];
        require(
            (fromToken == tokenA && toToken == tokenB) ||
            (fromToken == tokenB && toToken == tokenA),
            "SimpleSwap: invalid pair"
        );

        IERC20(fromToken).transferFrom(msg.sender, address(this), amountIn);

        uint256 _reserveIn  = fromToken == tokenA ? reserveA : reserveB;
        uint256 _reserveOut = toToken   == tokenA ? reserveA : reserveB;

        uint256 amountOut = getAmountOut(amountIn, _reserveIn, _reserveOut);
        require(amountOut >= amountOutMin, "SimpleSwap: slippage");

        IERC20(toToken).transfer(to, amountOut);

        if (fromToken == tokenA) {
            reserveA = _reserveIn + amountIn;
            reserveB = _reserveOut - amountOut;
        } else {
            reserveB = _reserveIn + amountIn;
            reserveA = _reserveOut - amountOut;
        }
    }

    /// @notice Returns the price of one token in terms of the other
    /// @param _tokenA Base token address
    /// @param _tokenB Quote token address
    /// @return price   Price scaled by 1e18
    function getPrice(address _tokenA, address _tokenB) external view returns (uint256 price) {
        require(
            (_tokenA == tokenA && _tokenB == tokenB) ||
            (_tokenA == tokenB && _tokenB == tokenA),
            "SimpleSwap: invalid pair"
        );

        uint256 _reserveA = reserveA;
        uint256 _reserveB = reserveB;

        if (_tokenA == tokenA) {
            price = (_reserveB * 1e18) / _reserveA;
        } else {
            price = (_reserveA * 1e18) / _reserveB;
        }
    }

    /// @notice Calculates output amount for a given input and reserves
    /// @param amountIn   Input token amount
    /// @param reserveIn  Reserve of input token
    /// @param reserveOut Reserve of output token
    /// @return amountOut Output token amount accounting for 0.3% fee
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256 amountOut) {
        require(amountIn > 0 && reserveIn > 0 && reserveOut > 0, "SimpleSwap: invalid input");
        uint256 amountInWithFee = amountIn * 997;
        uint256 numerator   = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * 1000) + amountInWithFee;
        amountOut = numerator / denominator;
    }

    /// @notice Computes integer square root of `y`
    /// @param y Input value
    /// @return z Approximate integer square root
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = (y / 2) + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}
