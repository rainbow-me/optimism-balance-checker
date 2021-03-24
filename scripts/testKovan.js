async function main() {
    // We get the contract to deploy
    const balanceChecker = await ethers.getContractAt("0x7b557B5Dd9dbdF3912215BfAA9e13BD5806A7613");
  
    console.log("BalanceChecker deployed to:", balanceChecker);

    const tokens = [
        '0x4200000000000000000000000000000000000006', // (w)ETH
        '0x7d669a64deb8a4a51eea755bb0e19fd39ce25ae9', // TEST DAI
    ];
    const addresses = ['0x7a3d05c70581bD345fe117c06e45f9669205384f'];

    const values = await BalanceChecker.balances(addresses, tokens);

    const balances = {};
    addresses.forEach((addr, addrIdx) => {
        balances[addr] = {};
        tokens.forEach((tokenAddr, tokenIdx) => {
            const balance = values[addrIdx * tokens.length + tokenIdx];
            balances[addr][tokenAddr] = balance;
        });
    });        

    console.log({balances });


  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });