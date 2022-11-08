require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
// const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
   
     mumbai: {
    //   //Infura
    //  //  url: `https://polygon-mumbai.infura.io/v3/${infuraId}`
         url: "https://rpc-mumbai.maticvigil.com",
        accounts: ["2a307771407ca3068fdec23fbe6d28941bd966ecb5dadd1e67597a6b5653977a"]
     },
    // matic: {
    //   // Infura
    //   // url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
    //   url: "https://rpc-mumbai.maticvigil.com",
    //   accounts: ["29f39464011f5a73e45c681ac176ec9a297de48a7a47d0c7c6e9a8f00bd08422"]
    // }
  
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

//contract address = 0x01fb4534235920bAC43B1c1239c8E4445A5A260a