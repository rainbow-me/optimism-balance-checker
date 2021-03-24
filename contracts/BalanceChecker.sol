// SPDX-License-Identifier: MIT
pragma solidity >0.6.0 <0.8.0;

/**
 * @title An ERC20 Balance Checker
 * @dev customized to work on the OVM!
 */
interface ERC20Token {
    function balanceOf(address) external view returns (uint256);
}
 

contract BalanceChecker {
  
  /*
    Check the token balance of a wallet in a token contract
    Returns the balance of the token for user. Avoids possible errors:
      - return 0 on non-contract address 
      - returns 0 if the contract doesn't implement balanceOf
  */
  function tokenBalance(address user, address token) public view returns (uint256) {
    // check if token is actually a contract
    uint256 tokenCode;
    assembly { tokenCode := extcodesize(token) } // contract code size
  
    if (tokenCode > 0){
        return ERC20Token(token).balanceOf(user);
    } 
    
    return 0;

  }

  /*
    Check the token balances of a wallet for multiple tokens.
    Pass 0x0 as a "token" address to get ETH balance.
    Possible error throws:
      - extremely large arrays for user and or tokens (gas cost too high) 
          
    Returns a one-dimensional that's user.length * tokens.length long. The
    array is ordered by all of the 0th users token balances, then the 1th
    user, and so on.
  */
  function balances(address[] memory users, address[] memory tokens) external view returns (uint[] memory) {
    uint256[] memory addrBalances = new uint256[](tokens.length * users.length);
    
    for(uint i = 0; i < users.length; i++) {
      for (uint j = 0; j < tokens.length; j++) {
        uint addrIdx = j + tokens.length * i;
        addrBalances[addrIdx] = tokenBalance(users[i], tokens[j]);
      }  
    }
    return addrBalances;
  }

}

