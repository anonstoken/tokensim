// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // const anons = await hre.ethers.getContractAt("Anons", "0xCfF6F8f04f8E17928A6A18d246e0EDA85d063a68");
  const anons = await hre.ethers.getContractAt("Anons", "0xCAcB8e095808BBc754f89c1e36582Fef63dAD15a");

  const ro = await anons.originalPurchase("0xbFA0C724e836FC83A7D9573353D2d795Ddc96641");
  console.log("RO originalPurchase", ro.toString())
  console.log((await hre.ethers.provider.getBlock(11599377)).timestamp)
  const [deployer] = await ethers.getSigners();
  const eventFilter = anons.filters.TransferType()

  console.log("Anons deployed to:", anons.address)
  const sinceBlock = 0;
  const events = await anons.queryFilter(eventFilter, sinceBlock)
  console.log("Events since block", sinceBlock)
  const eventTypes = {
    "0": { "name": "CONTRACT", "M": 0, "G": 0 },
    "1": { "name": "FASTSELL", "M": 15, "G": 5 },
    "2": { "name": "BUY", "M": 0, "G": 2 },
    "10": { "name": "SELL", "M": 8, "G": 2 },
  }
  let macc = hre.ethers.BigNumber.from(0);
  let gacc = hre.ethers.BigNumber.from(0);

  let totalEth = hre.ethers.BigNumber.from(0);
  let totalMEth = hre.ethers.BigNumber.from(0);
  let totalGEth = hre.ethers.BigNumber.from(0);
  let lastSendEthBlock = sinceBlock;

  events.forEach(e =>  {
    const { ethSent, transferType, amount} = e.args
    const etype = eventTypes[fee.toString()]
    const M = amount.div(hre.ethers.BigNumber.from(100)).mul(hre.ethers.BigNumber.from(etype.M))
    const G = amount.div(hre.ethers.BigNumber.from(100)).mul(hre.ethers.BigNumber.from(etype.G))
    console.log("B:", e.blockNumber,
      etype.name,
      "EthSent:", hre.ethers.utils.formatEther(ethSent),
      `+M(${etype.M}%):`, M.div(1e9).toString(),
      `+G(${etype.G}%):`, G.div(1e9).toString(),
      " ANONS:", amount.div(1e9).toString());
      if(!ethSent.isZero()) {
        const mshare = macc.mul(10000).div(macc.add(gacc)).add(1)
        const gshare = gacc.mul(10000).div(macc.add(gacc))
        const meth = ethSent.mul(mshare).div(10000)
        const geth = ethSent.mul(gshare).div(10000)
        console.log("EthSent:", hre.ethers.utils.formatEther(ethSent), `M(${mshare.toString()}%):`, hre.ethers.utils.formatEther(meth), `G(${gshare.toString()}%):`, hre.ethers.utils.formatEther(geth))
        totalEth = totalEth.add(ethSent)
        totalMEth = totalMEth.add(meth)
        totalGEth = totalGEth.add(geth)
        macc = hre.ethers.BigNumber.from(0);
        gacc = hre.ethers.BigNumber.from(0);
        lastSendEthBlock = e.blockNumber
      }
      macc = M.add(macc)
      gacc = G.add(gacc)
      //console.log("macc", macc.toString(), "gacc", gacc.toString())
  });
  console.log()
  const mTotalShare = totalMEth.mul(100).div(totalEth)
  const gTotalShare = totalGEth.mul(100).div(totalEth)
  console.log(`Total Eth:${hre.ethers.utils.formatEther(totalEth)} of which Marketing(${mTotalShare.toString()}%):${hre.ethers.utils.formatEther(totalMEth)} Giveaway(${gTotalShare.toString()}%):${hre.ethers.utils.formatEther(totalGEth)}`)
  console.log("Last EthSent Block", lastSendEthBlock)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
