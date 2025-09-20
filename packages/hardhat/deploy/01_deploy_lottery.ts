import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * @dev 部署 Lottery 合约
 * @param hre HardhatRuntimeEnvironment 实例
 */
const deployLottery: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying Lottery contract...");
  console.log("Deployer:", deployer);

  const lotteryDeployment = await deploy("Lottery", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  console.log("Lottery contract deployed to:", lotteryDeployment.address);
  console.log("Deployment transaction hash:", lotteryDeployment.transactionHash);

  // 验证合约部署
  if (lotteryDeployment.newlyDeployed) {
    console.log("✅ Lottery contract successfully deployed!");
  } else {
    console.log("⚠️  Lottery contract was already deployed at:", lotteryDeployment.address);
  }
};

export default deployLottery;

// 设置部署标签
deployLottery.tags = ["Lottery"];
