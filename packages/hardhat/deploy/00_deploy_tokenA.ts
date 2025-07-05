import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("TokenA", {
    from: deployer,
    args: [deployer], // Si el constructor necesita un address (por ejemplo, como owner)
    log: true,
  });
};

export default func;
func.tags = ["TokenA"];
