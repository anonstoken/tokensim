require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");

const { MAINNET_API_URL, RINKEBY_API_URL, ROPSTEN_API_URL, PK, MNEMONIC } = process.env;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [{version: "0.8.9"}, {version: "0.8.4"}, {version:"0.6.12"}, {version: "0.4.25"}],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  gasReporter: {
    currency: 'USD',
    coinmarketcap: "7853324f-c3e3-45c5-88d1-96bbc84ee6ae"
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/"
    },
    hardhat: {
      forking: {
        url: MAINNET_API_URL,
        blockNumber: 13708000
      }  
    },
    rinkeby: {
       url: RINKEBY_API_URL,
       accounts: {mnemonic: MNEMONIC }
    },
    ropsten: {
      url: ROPSTEN_API_URL,
      accounts: [`${PK}`]
   },
    bsctestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: {mnemonic: MNEMONIC}
    },
    bscmainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: {mnemonic: MNEMONIC}
    }
 },
};
