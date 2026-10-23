const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  console.log("==================================================");
  console.log("   Deploying ChainNotes to Botchain Mainnet (677)  ");
  console.log("==================================================");

  const rpcUrl = process.env.BOTCHAIN_MAINNET_RPC_URL || "https://rpc.botchain.ai";
  const rawKey = process.env.PRIVATE_KEY;

  if (!rawKey) {
    console.error("Error: PRIVATE_KEY not found in .env");
    process.exit(1);
  }

  const privateKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const network = await provider.getNetwork();
  console.log(`Connected Network Chain ID: ${network.chainId.toString()}`);

  if (network.chainId !== 677n) {
    console.warn(`Warning: Expected Chain ID 677 (Botchain Mainnet), got ${network.chainId.toString()}`);
  }

  const wallet = new ethers.Wallet(privateKey, provider);
  const balance = await provider.getBalance(wallet.address);

  console.log(`Deployer Address:          ${wallet.address}`);
  console.log(`Deployer Balance:          ${ethers.formatEther(balance)} BOT`);

  if (balance === 0n) {
    console.error("Error: Deployer balance is 0 BOT. Cannot deploy.");
    process.exit(1);
  }

  // Load contract artifact
  const artifactPath = path.resolve(__dirname, "../artifacts/contracts/ChainNotes.sol/ChainNotes.json");
  if (!fs.existsSync(artifactPath)) {
    console.error(`Error: Artifact not found at ${artifactPath}`);
    process.exit(1);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  // Fetch current gas price
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice || 20000000000n; // ~20 gwei
  console.log(`Network Gas Price:         ${ethers.formatUnits(gasPrice, "gwei")} gwei (${gasPrice.toString()} wei)`);

  // Estimate gas
  const deployTx = await factory.getDeployTransaction();
  const estimatedGas = await provider.estimateGas(deployTx);
  const estimatedTotalCost = estimatedGas * gasPrice;

  console.log(`Estimated Gas Units:       ${estimatedGas.toString()}`);
  console.log(`Estimated Deployment Cost: ${ethers.formatEther(estimatedTotalCost)} BOT`);

  if (balance < estimatedTotalCost) {
    console.error("Error: Balance is lower than estimated cost.");
    process.exit(1);
  }

  // Safe minimal gas limit (10% headroom)
  const gasLimit = (estimatedGas * 110n) / 100n;

  console.log("\nBroadcasting deployment transaction with optimal low-gas settings...");
  const contract = await factory.deploy({
    gasPrice,
    gasLimit,
  });

  const txHash = contract.deploymentTransaction().hash;
  console.log(`Transaction Hash:          ${txHash}`);
  console.log(`Transaction Explorer Link: https://scan.botchain.ai/tx/${txHash}`);
  console.log("Waiting for block confirmation...");

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("\n==================================================");
  console.log("🎉 ChainNotes Deployed Successfully on Mainnet!");
  console.log("==================================================");
  console.log(`Contract Address:          ${contractAddress}`);
  console.log(`Verified Contract Link:    https://scan.botchain.ai/address/${contractAddress}`);
  console.log("==================================================");

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
    console.log(`\nUpdated .env with NEXT_PUBLIC_CHAIN_NOTES_ADDRESS=${contractAddress}`);
  }
}

main().catch((err) => {
  console.error("Deployment failed:", err);
  process.exit(1);
});
