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
  const Anons = await hre.ethers.getContractFactory("Anons");

  const [deployer] = await ethers.getSigners();
  const addr = (await deployer.getAddress())
  console.log("Deploying contract. Deployer:", addr)
  const anons = await Anons.deploy("0xFfFFff2232E8b10707dbf64B51CaeDd568B03e13");
  const dtx = await anons.deployed()

  console.log("Anons deployed to:", anons.address)

  await deployer.sendTransaction({
    to: anons.address,
    value: ethers.utils.parseEther("0.0015")
  });
  console.log("0.0015 eth transferred to contract")

  await anons.transfer(anons.address, hre.ethers.BigNumber.from("950000000000000000"))

  console.log("950_000_000_000_000_000 Anons trasfered to Contract")

  console.log("calling openTrading")
  const tx = await anons.openTrading();
  await tx.wait();

  const uniPair = (await anons.uniswapV2Pair());
  console.log("UniPair address:", uniPair)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
