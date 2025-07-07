// scripts/generate.ts
import path from "path";
import scaffoldConfig from "~~/scaffold.config";
import { generateDeployedContractsTypes } from "~~/utils/scaffold-eth/generator";

const deploymentsFolderPath = path.join(__dirname, "../../hardhat/deployments");

async function main() {
  console.log("🔄 Generating deployedContracts.ts...");
  try {
    await generateDeployedContractsTypes({
      deploymentsFolderPath,
      config: scaffoldConfig,
      saveToFile: true,
    });
    console.log("✅ deployedContracts.ts generated successfully.");
  } catch (error) {
    console.error("❌ Error generating deployedContracts.ts:", error);
    process.exit(1);
  }
}

main();
