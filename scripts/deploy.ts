import hre from "hardhat";
const { ethers, network } = hre;
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();

  if (!deployer) {
    console.error("Error: No deployer account configured.");
    console.error("Please set PRIVATE_KEY in your .env file.");
    process.exit(1);
  }

  const networkObj = await ethers.provider.getNetwork();
  const chainId = Number(networkObj.chainId);
  const networkTitle = "Botchain Mainnet";
  const explorerBase = "https://scan.botchain.ai";

  console.log("==========================================");
  console.log(`ChainNotes - Deployment to ${networkTitle}`);
  console.log("==========================================");

  const balance = await ethers.provider.getBalance(deployer.address);
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || 20000000000n; // Use current network gasPrice (e.g. 20 gwei)

  console.log(`Network:          ${networkTitle} (Chain ID: ${chainId})`);
  console.log(`Deployer Address: ${deployer.address}`);
  console.log(`Deployer Balance: ${ethers.formatEther(balance)} BOT`);
  console.log(`Current GasPrice: ${ethers.formatUnits(gasPrice, "gwei")} gwei (${gasPrice.toString()} wei)`);

  if (balance === 0n) {
    console.error("\nError: Deployer account has 0 BOT balance.");
    console.error(`Please fund your wallet with BOT tokens on ${networkTitle}.`);
    console.error(`Explorer: ${explorerBase}`);
    process.exit(1);
  }

  console.log("\nPreparing ChainNotes contract deployment...");
  const ChainNotesFactory = await ethers.getContractFactory("ChainNotes");

  // Estimate gas
  const deployTxData = await ChainNotesFactory.getDeployTransaction();
  const estimatedGas = await ethers.provider.estimateGas(deployTxData);
  const estimatedCost = estimatedGas * gasPrice;

  console.log(`Estimated Gas:    ${estimatedGas.toString()} units`);
  console.log(`Estimated Cost:   ${ethers.formatEther(estimatedCost)} BOT`);

  if (balance < estimatedCost) {
    console.error("\nError: Insufficient balance to cover deployment gas.");
    process.exit(1);
  }

  console.log("\nBroadcasting deployment transaction with minimal gas settings...");
  // Use optimal gas settings: gasPrice explicitly set to current network rate, gasLimit with a safe 15% buffer
  const gasLimit = (estimatedGas * 115n) / 100n;
  const chainNotes = await ChainNotesFactory.deploy({
    gasPrice,
    gasLimit,
  });

  console.log(`Transaction sent! Waiting for confirmation...`);
  const deploymentTx = chainNotes.deploymentTransaction();
  if (deploymentTx) {
    console.log(`Tx Hash:          ${deploymentTx.hash}`);
    console.log(`Explorer Tx:      ${explorerBase}/tx/${deploymentTx.hash}`);
  }

  await chainNotes.waitForDeployment();
  const contractAddress = await chainNotes.getAddress();

  console.log("\n==========================================");
  console.log("Deployment Successful!");
  console.log("==========================================");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Explorer Link:    ${explorerBase}/address/${contractAddress}`);
  console.log("==========================================");

  // Update .env file automatically
  const envPath = path.resolve(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf8");
    if (envContent.includes("NEXT_PUBLIC_CHAIN_NOTES_ADDRESS=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CHAIN_NOTES_ADDRESS=.*/,
        `NEXT_PUBLIC_CHAIN_NOTES_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_CHAIN_NOTES_ADDRESS=${contractAddress}\n`;
    }

    if (envContent.includes("NEXT_PUBLIC_BOT_NOTES_ADDRESS=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_BOT_NOTES_ADDRESS=.*/,
        `NEXT_PUBLIC_BOT_NOTES_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_BOT_NOTES_ADDRESS=${contractAddress}\n`;
    }

    if (envContent.includes("BOTCHAIN_MAINNET_RPC_URL=")) {
      envContent = envContent.replace(
        /BOTCHAIN_MAINNET_RPC_URL=.*/,
        `BOTCHAIN_MAINNET_RPC_URL=https://rpc.botchain.ai`
      );
    } else {
      envContent += `\nBOTCHAIN_MAINNET_RPC_URL=https://rpc.botchain.ai\n`;
    }

    fs.writeFileSync(envPath, envContent, "utf8");
    console.log(`Updated .env with NEXT_PUBLIC_CHAIN_NOTES_ADDRESS=${contractAddress}`);
  }
}

main().catch((error) => {
  console.error("Deployment failed with error:", error);
  process.exitCode = 1;
});
