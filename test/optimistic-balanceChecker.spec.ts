import { expect } from './setup'

import { ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'

describe('Optimistic BalanceChecker', () => {
  let account1: Signer;
  let account2: Signer;
  let account3: Signer;
  before(async () => {
    [account1, account2, account3] = await ethers.getSigners();
  })

  const name1 = 'BlueChip';
  const name2 = 'Shitcoin';
  const initialSupply = 10000000;

  let Token1: Contract
  let Token2: Contract
  let BalanceChecker: Contract
  beforeEach(async () => {
    Token1 = await (await ethers.getContractFactory('ERC20'))
      .connect(account1)
      .deploy(initialSupply, name1);
    Token2 = await (await ethers.getContractFactory('ERC20'))
    .connect(account1)
    .deploy(initialSupply / 2, name2);

    BalanceChecker = await (await ethers.getContractFactory('BalanceChecker'))
      .connect(account1)
      .deploy();
  });

  describe('the basics', () => {
    it('should return zero for a non contract address', async () => {
        const userAddress = await account1.getAddress();
        const nonContractAddress = await account2.getAddress();
        const tokenBalanceViaBalanceChecker = await BalanceChecker.tokenBalance(userAddress, nonContractAddress);

        expect(tokenBalanceViaBalanceChecker).to.equal(
            0
        );
    });
    
    
    it('should let you check the balance of an individual token', async () => {
        const userAddress = await account1.getAddress();
        
        const tokenBalance = await Token1.balanceOf(userAddress);

        const tokenBalanceViaBalanceChecker = await BalanceChecker.tokenBalance(userAddress, Token1.address);

        expect(tokenBalance).to.equal(
            tokenBalanceViaBalanceChecker
        );
    });

    it('should let you check the balance of an multiple token and addresses at once', async () => {
        
        const sender = account1;
        const recipient = account2;
        const senderAddress = await sender.getAddress();
        const recipientAddress = await recipient.getAddress();
        const amount = 2500000;

        await Token2.connect(sender).transfer(recipientAddress, amount);
        const normalBalances = {
            [senderAddress]: {
                [Token1.address]: await Token1.balanceOf(senderAddress),
                [Token2.address]: await Token2.balanceOf(senderAddress),
            },
            [recipientAddress]: { 
                [Token1.address]: await Token1.balanceOf(recipientAddress),
                [Token2.address]: await Token2.balanceOf(recipientAddress),
            }
        };

        const addresses = [senderAddress, recipientAddress];
        const tokens = [Token1.address, Token2.address];
        const values = await BalanceChecker.balances(addresses, tokens);

        addresses.forEach((addr, addrIdx) => {
            tokens.forEach((tokenAddr, tokenIdx) => {
                const balance = values[addrIdx * tokens.length + tokenIdx];
                expect(balance).to.equal(
                    normalBalances[addr][tokenAddr]
                );
            });
        });        
    });
  });

      
  it('should let you check the balance of ETH', async () => {
    const userAddress = await account1.getAddress();
    const ethBalance = await account1.getBalance();

    const balanceCheckerResponse = await BalanceChecker.balances([userAddress], [ethers.constants.AddressZero]);
    const ethBalanceViaBalanceChecker = balanceCheckerResponse[0];

    expect(ethBalance).to.equal(
        ethBalanceViaBalanceChecker
    );
  });

})
