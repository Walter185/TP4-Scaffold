// 00_deploy_tokenA.ts
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployTokenA: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("TokenA", {
    from: deployer,
    args: [deployer],
    log: true,
  });
};

export default deployTokenA;
deployTokenA.tags = ["TokenA"];
