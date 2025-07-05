import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // Obtiene las direcciones de los contratos TokenA y TokenB ya desplegados
  const tokenADeployment = await deployments.get("TokenA");
  const tokenBDeployment = await deployments.get("TokenB");

  await deploy("SimpleSwap", {
    from: deployer,
    args: [tokenADeployment.address, tokenBDeployment.address],
    log: true,
  });
};

export default func;
func.tags = ["SimpleSwap"];
