import { HardhatUserConfig } from 'hardhat/types'

import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'

const config: HardhatUserConfig = {
  solidity: "0.8.7",
  networks: {
    hardhat: {},
    kovanovm: {
      url: "https://kovan.optimism.io",
      accounts: [
        // Your PK goes here!
      ],
      gas: 0
    }
  },
};

export default config
