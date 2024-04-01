const hre = require("hardhat");

async function main() {
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hi Dev Azeez");

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();

  await greeter.waitForDeployment();
  await token.waitForDeployment();

  console.log(`Greeter contract successfully deployed to: ${greeter.target}`);
  console.log(`Token contract successfully deployed to: ${token.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
