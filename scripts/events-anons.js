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
  const anons = await hre.ethers.getContractAt("Anons", "0x5A8328d869D6194965e6313dFe54cEcbd8E0cBd0");

  const [deployer] = await ethers.getSigners();
  const eventFilter = anons.filters.TransferType()

  console.log("Anons deployed to:", anons.address)
  const sinceBlock = 0;
  const events = await anons.queryFilter(eventFilter, sinceBlock)
  console.log("Events since block", sinceBlock)
  events.forEach(e => {
    const {fee, amount} = e.args
    console.log("Block:", e.blockNumber, "Fee:", fee.toString(), " Amount:", amount.toString())
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
