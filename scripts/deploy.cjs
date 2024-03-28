const hre = require("hardhat");

async function main() {
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hi Dev Azeez");
  await greeter.waitForDeployment();

  console.log(`contract successfully deployed to: ${greeter.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
