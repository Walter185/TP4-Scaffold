// 02_deploy_simpleSwap.ts
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deploySimpleSwap: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const tokenADeployment = await get("TokenA");
  const tokenBDeployment = await get("TokenB");

  await deploy("SimpleSwap", {
    from: deployer,
    args: [tokenADeployment.address, tokenBDeployment.address],
    log: true,
  });
};

export default deploySimpleSwap;
deploySimpleSwap.tags = ["SimpleSwap"];
deploySimpleSwap.dependencies = ["TokenA", "TokenB"];
