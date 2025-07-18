// 01_deploy_tokenB.ts
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployTokenB: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("TokenB", {
    from: deployer,
    args: [deployer],
    log: true,
  });
};

export default deployTokenB;
deployTokenB.tags = ["TokenB"];
deployTokenB.dependencies = ["TokenA"];
