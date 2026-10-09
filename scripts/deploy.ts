import hre from "hardhat";
const { ethers, network } = hre;
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("==========================================");
  console.log("ChainNotes - Deployment to Botchain Testnet");
  console.log("==========================================");

  const [deployer] = await ethers.getSigners();

  if (!deployer) {
    console.error("Error: No deployer account configured.");
    console.error("Please set PRIVATE_KEY in your .env file.");
    process.exit(1);
  }

  const networkName = network.name;
  const chainId = (await ethers.provider.getNetwork()).chainId;
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log(`Network Name:     ${networkName}`);
  console.log(`Chain ID:         ${chainId.toString()}`);
  console.log(`Deployer Address: ${deployer.address}`);
  console.log(`Deployer Balance: ${ethers.formatEther(balance)} BOT`);

  if (balance === 0n) {
    console.error("\nError: Deployer account has 0 BOT balance.");
    console.error("Please fund your wallet with Botchain Testnet (BOT) tokens to pay for deployment gas.");
    console.error("Explorer / Faucet details: https://scan.bohr.life");
    process.exit(1);
  }

  console.log("\nDeploying ChainNotes contract...");
  const ChainNotesFactory = await ethers.getContractFactory("ChainNotes");
  const chainNotes = await ChainNotesFactory.deploy();

  await chainNotes.waitForDeployment();
  const contractAddress = await chainNotes.getAddress();

  console.log("\n==========================================");
  console.log("Deployment Successful!");
  console.log("==========================================");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Explorer Link:    https://scan.bohr.life/address/${contractAddress}`);
  console.log("\nNext Steps:");
  console.log(`1. Update your .env or .env.local file:`);
  console.log(`   NEXT_PUBLIC_CHAIN_NOTES_ADDRESS=${contractAddress}`);
  console.log("==========================================");
}

main().catch((error) => {
  console.error("Deployment failed with error:", error);
  process.exitCode = 1;
});
