import * as dotenv from "dotenv";
dotenv.config();
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 * 合约验证脚本
 * 用于验证已部署的合约
 */
class ContractVerifier {
  private hre: HardhatRuntimeEnvironment;
  private networkName: string;

  constructor(hre: HardhatRuntimeEnvironment, networkName: string) {
    this.hre = hre;
    this.networkName = networkName;
  }

  /**
   * 验证合约
   * @param contractAddress 合约地址
   * @param contractName 合约名称
   * @param constructorArgs 构造函数参数
   */
  async verifyContract(contractAddress: string, contractName: string, constructorArgs: any[] = []): Promise<boolean> {
    console.log(`\n🔍 开始验证 ${contractName} 合约...`);
    console.log(`📍 合约地址: ${contractAddress}`);
    console.log(`🌐 网络: ${this.networkName}`);

    try {
      await this.hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: constructorArgs,
      });

      console.log(`✅ ${contractName} 合约验证成功!`);
      return true;
    } catch (error: any) {
      if (error.message.includes("Already Verified")) {
        console.log(`✅ ${contractName} 合约已经验证过了`);
        return true;
      } else {
        console.log(`❌ ${contractName} 合约验证失败:`, error.message);
        return false;
      }
    }
  }

  /**
   * 验证多个合约
   * @param contracts 合约信息数组
   */
  async verifyMultipleContracts(
    contracts: Array<{
      address: string;
      name: string;
      constructorArgs?: any[];
    }>,
  ): Promise<void> {
    console.log(`\n🚀 开始批量验证合约...`);

    let successCount = 0;
    const totalCount = contracts.length;

    for (const contract of contracts) {
      const success = await this.verifyContract(contract.address, contract.name, contract.constructorArgs || []);

      if (success) {
        successCount++;
      }

      // 等待一段时间避免请求过于频繁
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`\n📊 验证结果: ${successCount}/${totalCount} 个合约验证成功`);
  }

  /**
   * 从部署记录中读取合约地址并验证
   */
  async verifyFromDeployments(): Promise<void> {
    console.log(`\n📖 从部署记录中读取合约信息...`);

    try {
      const deployments = await this.hre.deployments.all();
      const contracts = Object.entries(deployments).map(([name, deployment]) => ({
        address: deployment.address,
        name: name,
        constructorArgs: deployment.args || [],
      }));

      if (contracts.length === 0) {
        console.log("⚠️  未找到部署记录");
        return;
      }

      await this.verifyMultipleContracts(contracts);
    } catch (error) {
      console.error("❌ 读取部署记录失败:", error);
    }
  }

  /**
   * 检查网络是否支持验证
   */
  isVerificationSupported(): boolean {
    const supportedNetworks = [
      "mainnet",
      "sepolia",
      "arbitrum",
      "arbitrumSepolia",
      "optimism",
      "optimismSepolia",
      "polygon",
      "polygonAmoy",
      "base",
      "baseSepolia",
      "scroll",
      "scrollSepolia",
      "celo",
      "celoSepolia",
    ];

    return supportedNetworks.includes(this.networkName);
  }
}

/**
 * 主函数
 */
async function main() {
  const hre = await import("hardhat");
  const networkName = process.argv[2] || hre.network.name;

  console.log(`🌐 当前网络: ${networkName}`);

  const verifier = new ContractVerifier(hre, networkName);

  // 检查是否支持验证
  if (!verifier.isVerificationSupported()) {
    console.log(`⚠️  网络 ${networkName} 不支持合约验证`);
    console.log(
      `✅ 支持的网络: mainnet, sepolia, arbitrum, arbitrumSepolia, optimism, optimismSepolia, polygon, polygonAmoy, base, baseSepolia, scroll, scrollSepolia, celo, celoSepolia`,
    );
    return;
  }

  // 检查命令行参数
  const contractAddress = process.argv[3];
  const contractName = process.argv[4] || "Contract";

  if (contractAddress) {
    // 验证指定合约
    await verifier.verifyContract(contractAddress, contractName);
  } else {
    // 验证所有已部署的合约
    await verifier.verifyFromDeployments();
  }
}

// 运行脚本
main().catch(error => {
  console.error(error);
  process.exit(1);
});
