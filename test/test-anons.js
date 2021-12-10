const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Anons", function () {
  it("s", async function () {
    const ANONS = await hre.ethers.getContractFactory("Anons");

    const [deployer, mccWallet, marketingWallet, eoa1Wallet, eoa2Wallet, eoa3Wallet] = await ethers.getSigners();
    const deployerAddr = (await deployer.getAddress());
    const taxAddr = (await mccWallet.getAddress());
    const eoa0Addr = (await marketingWallet.getAddress());
    const eoa1Addr = (await eoa1Wallet.getAddress());
    const eoa2Addr = (await eoa2Wallet.getAddress());
    const eoa3Addr = (await eoa3Wallet.getAddress());

    console.log(deployerAddr, taxAddr, eoa0Addr, eoa1Addr, eoa2Addr, eoa3Addr);
    let uniPair;

    const logBalances = async (anons) => {
      const status = async (addr) => ["Anons", (await anons.balanceOf(addr)).toString(), " ETH", ethers.utils.formatEther((await deployer.provider.getBalance(addr)))];//, (await mcc.getRTBalance(addr)).map(ethers.utils.formatEther),]
      console.log("Balances==============================================================");
      console.log("Deployer -", ... await status(deployerAddr));
      console.log("Contract -", ... await status(anons.address));
      uniPair && console.log("UniPair -", ... await status(uniPair));
      console.log("Tax Wallet -", ... await status(taxAddr));
      console.log("EOA0 -", ... await status(eoa0Addr));
      console.log("EOA1 -", ... await status(eoa1Addr));
      console.log("EOA2 -", ... await status(eoa2Addr));
      console.log("EOA3 -", ... await status(eoa3Addr));
      const sumOfBal = await [uniPair, anons.address, deployerAddr, taxAddr, eoa0Addr, eoa1Addr, eoa2Addr, eoa3Addr].filter(Boolean).map(async (addr) => (await anons.balanceOf(addr))).reduce(async (a, b) => (await a).add(await b), ethers.BigNumber.from(0))
      console.log("Sum of balances:", sumOfBal.toString());
      console.log("Total Supply:   ", (await anons.totalSupply()).toString());
      console.log();
    }

    const anons = await ANONS.deploy(taxAddr);

    await anons.deployed();

    console.log("Anons token deployed to:", anons.address);
    await logBalances(anons);

    await deployer.sendTransaction({
      to: anons.address,
      value: ethers.utils.parseEther("1.5")
    });

    console.log("1.5 eth transferred to contract")

    await anons.transfer(anons.address, 864_500_000_000)
    console.log("864_500_000_000 Anons trasfered to Contract")

    //await anons.removeStrictTxLimit();

    console.log("calling openTrading")
    await anons.openTrading();

    uniPair = (await anons.uniswapV2Pair());
    console.log("UniPair address:", uniPair)

    expect(await anons.symbol()).to.equal("ANONS");

    
    await logBalances(anons);
    console.log("Transferring 1e7 coins from deployer to eoa1");
    await anons.transfer(eoa1Addr, 1e7);
    await logBalances(anons);

    console.log("Transferring 1e6 coins from eoa1 to eoa2");
    await anons.connect(eoa1Wallet).transfer(eoa2Addr, 1e6);
    await logBalances(anons);

    console.log("Transferring 10 coins from eoa2 to eoa3");
    await anons.connect(eoa2Wallet).transfer(eoa3Addr, 10);
    await logBalances(anons);

    console.log("Transferring 10 coins from eoa2 to eoa3");
    await anons.connect(eoa2Wallet).transfer(eoa3Addr, 10);
    await logBalances(anons);

    console.log();

  })
})
