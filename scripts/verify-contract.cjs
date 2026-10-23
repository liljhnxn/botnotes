const fs = require("fs");
const path = require("path");

async function verify() {
  const contractAddress = "0x4d59A58eA052f72eFC2c82165457A98AC4Ad0Afa";
  const sourceCode = fs.readFileSync(
    path.resolve(__dirname, "../contracts/ChainNotes.sol"),
    "utf8"
  );

  console.log("Submitting verification for:", contractAddress);
  console.log("Compiler version: v0.8.24+commit.e11b9ed9");

  const formData = new URLSearchParams();
  formData.append("apikey", "any");
  formData.append("module", "contract");
  formData.append("action", "verifysourcecode");
  formData.append("contractaddress", contractAddress);
  formData.append("sourceCode", sourceCode);
  formData.append("codeformat", "solidity-single-file");
  formData.append("contractname", "ChainNotes");
  formData.append("compilerversion", "v0.8.24+commit.e11b9ed9");
  formData.append("optimizationUsed", "1");
  formData.append("runs", "200");
  formData.append("evmversion", "paris");
  formData.append("licenseType", "3"); // MIT

  const res = await fetch("https://scan.botchain.ai/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const data = await res.json();
  console.log("Verification response:", data);

  if (data.status === "1" || data.message === "OK") {
    const guid = data.result;
    console.log("Verification submitted! GUID / Result:", guid);
    // Poll for status
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const checkRes = await fetch(
        `https://scan.botchain.ai/api?module=contract&action=checkverifystatus&guid=${guid}`
      );
      const checkData = await checkRes.json();
      console.log(`Poll [${i + 1}]:`, checkData);
      if (checkData.result === "Pass - Verified" || checkData.message === "OK" || (checkData.result && checkData.result.includes("Verified"))) {
        console.log("🎉 Contract Verified Successfully!");
        break;
      }
      if (checkData.result && checkData.result.includes("Fail")) {
        console.log("Verification failed:", checkData.result);
        break;
      }
    }
  }
}

verify().catch(console.error);
