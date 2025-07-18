// File: TokenA.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title TokenA ERC20 Mintable Token
/// @author Walter Liendo
/// @notice ERC20 token that can be minted by the owner
/// @dev    Inherits from OpenZeppelin ERC20 and Ownable
contract TokenA is ERC20, Ownable {
    /// @notice Sets the deployer as the initial owner
    /// @param initialOwner The address that will have the minting permission
    constructor(address initialOwner) ERC20("TokenA", "TKA") Ownable(initialOwner) {}

    /// @notice Mints `amount` tokens to address `to`
    /// @dev    Can only be called by the owner
    /// @param to     The address to receive minted tokens
    /// @param amount The number of tokens to mint (in smallest unit)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}