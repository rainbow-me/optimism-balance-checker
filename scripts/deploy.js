const { ethers } = require("hardhat");

async function main() {
    // We get the contract to deploy

    const BalanceChecker = await ethers.getContractFactory("BalanceChecker");
    const balanceChecker = await BalanceChecker.deploy();
  
    console.log("BalanceChecker deployed to:", balanceChecker.address);

  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });