const { expect } = require("chai");
const { ethers } = require("hardhat");
ethers.utils.BN
describe("MultiChainCapital", function () {
  it("s", async function () {
    const MCC = await hre.ethers.getContractFactory("MultiChainCapital");

    const [deployer, mccWallet, marketingWallet, eoa1Wallet, eoa2Wallet, eoa3Wallet] = await ethers.getSigners();
    const deployerAddr = (await deployer.getAddress());
    const mccAddr = (await mccWallet.getAddress());
    const marketingAddr = (await marketingWallet.getAddress());
    const eoa1Addr = (await eoa1Wallet.getAddress());
    const eoa2Addr = (await eoa2Wallet.getAddress());
    const eoa3Addr = (await eoa3Wallet.getAddress());

    console.log(deployerAddr, mccAddr, marketingAddr, eoa1Addr, eoa2Addr, eoa3Addr);
    const mcc = await MCC.deploy(mccAddr, marketingAddr);

    await mcc.deployed();

    console.log("MultiChainCapital deployed to:", mcc.address);

    const uniPair = (await mcc.uniswapV2Pair());
    console.log("UniPair address:", uniPair)

    expect(await mcc.symbol()).to.equal("MCC");

    const logBalances = async (mcc) => {
      const status = async (addr) => [(await mcc.balanceOf(addr)).toString()];//, (await mcc.getRTBalance(addr)).map(ethers.utils.formatEther), ethers.utils.formatEther((await deployer.provider.getBalance(addr)))]
      console.log("Balances==============================================================");
      console.log("Deployer -", ... await status(deployerAddr));
      console.log("Contract -", ... await status(mcc.address));
      console.log("UniPair -", ... await status(uniPair));
      console.log("MCC Wallet -", ... await status(mccAddr));
      console.log("Marketing -", ... await status(marketingAddr));
      console.log("EOA1 -", ... await status(eoa1Addr));
      console.log("EOA2 -", ... await status(eoa2Addr));
      console.log("EOA3 -", ... await status(eoa3Addr));
      const sumOfBal = await [uniPair, mcc.address, deployerAddr, mccAddr, marketingAddr, eoa1Addr, eoa2Addr, eoa3Addr].map(async (addr) => (await mcc.balanceOf(addr))).reduce(async (a,b)=>(await a).add(await b), ethers.BigNumber.from(0))
      console.log("Sum of balances:", sumOfBal.toString());
      console.log("Total Supply:   ", (await mcc.totalSupply()).toString());
      console.log("_getCurrentSupply:", (await mcc._getCurrentSupply()).toString());
      console.log("Contract ETH Balance:", (await mcc._getETHBalance()).toString())
      console.log();
    }
    await logBalances(mcc);
    console.log("Transferring 1e7 coins from deployer to eoa1");
    await mcc.transfer(eoa1Addr, 1e7);
    await logBalances(mcc);

    console.log("Transferring 1e6 coins from eoa1 to eoa2");
    await mcc.connect(eoa1Wallet).transfer(eoa2Addr, 1e6);
    await logBalances(mcc);

    console.log("Transferring 10 coins from eoa2 to eoa3");
    await mcc.connect(eoa2Wallet).transfer(eoa3Addr, 10);
    await logBalances(mcc);

    console.log("Transferring 10 coins from eoa2 to eoa3");
    await mcc.connect(eoa2Wallet).transfer(eoa3Addr, 10);
    await logBalances(mcc);

    console.log();

  });
});
