import * as dotenv from "dotenv";
dotenv.config();
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "ethers";
import { Wallet } from "ethers";
import password from "@inquirer/password";

/**
 * 测试网部署脚本
 * 支持多种测试网部署，包括合约验证
 */
class TestnetDeployer {
  private hre: HardhatRuntimeEnvironment;
  private deployer!: Wallet;
  private networkName: string;

  constructor(hre: HardhatRuntimeEnvironment, networkName: string) {
    this.hre = hre;
    this.networkName = networkName;
  }

  /**
   * 初始化部署者账户
   */
  async initializeDeployer(): Promise<void> {
    console.log(`🚀 开始部署到 ${this.networkName} 测试网...`);

    // 检查环境变量
    const privateKey = process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY;
    const encryptedKey = process.env.DEPLOYER_PRIVATE_KEY_ENCRYPTED;

    if (privateKey) {
      // 使用明文私钥
      this.deployer = new Wallet(privateKey, this.hre.ethers.provider);
      console.log("✅ 使用环境变量中的私钥");
    } else if (encryptedKey) {
      // 使用加密私钥
      const pass = await password({ message: "请输入密码来解密私钥:" });
      try {
        const wallet = await Wallet.fromEncryptedJson(encryptedKey, pass);
        this.deployer = wallet.connect(this.hre.ethers.provider) as Wallet;
        console.log("✅ 成功解密私钥");
      } catch {
        throw new Error("❌ 私钥解密失败，请检查密码");
      }
    } else {
      throw new Error("❌ 未找到部署者私钥，请设置 DEPLOYER_PRIVATE_KEY_ENCRYPTED 或 __RUNTIME_DEPLOYER_PRIVATE_KEY");
    }

    // 检查账户余额
    const balance = await this.hre.ethers.provider.getBalance(this.deployer.address);
    const balanceInEth = ethers.formatEther(balance);
    console.log(`💰 部署者地址: ${this.deployer.address}`);
    console.log(`💰 账户余额: ${balanceInEth} ETH`);

    if (balance === 0n) {
      throw new Error("❌ 账户余额不足，请先获取测试网代币");
    }
  }

  /**
   * 部署 Lottery 合约
   */
  async deployLottery(): Promise<string> {
    console.log("\n📦 开始部署 Lottery 合约...");

    const Lottery = await this.hre.ethers.getContractFactory("Lottery");
    const lottery = await Lottery.connect(this.deployer).deploy();
    await lottery.waitForDeployment();

    const contractAddress = await lottery.getAddress();
    console.log(`✅ Lottery 合约部署成功!`);
    console.log(`📍 合约地址: ${contractAddress}`);
    console.log(`🔗 交易哈希: ${lottery.deploymentTransaction()?.hash}`);

    return contractAddress;
  }

  /**
   * 验证合约
   */
  async verifyContract(contractAddress: string, contractName: string): Promise<void> {
    console.log(`\n🔍 开始验证 ${contractName} 合约...`);

    try {
      await this.hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log(`✅ ${contractName} 合约验证成功!`);
    } catch (error) {
      console.log(`⚠️  ${contractName} 合约验证失败:`, error);
    }
  }

  /**
   * 更新前端合约配置
   */
  async updateFrontendConfig(contractAddress: string): Promise<void> {
    console.log("\n🔄 更新前端合约配置...");

    try {
      // 这里可以添加更新 deployedContracts.ts 的逻辑
      console.log(`📍 请手动更新 packages/nextjs/contracts/deployedContracts.ts`);
      console.log(`📍 将 ${this.networkName} 网络的 Lottery 合约地址更新为: ${contractAddress}`);
    } catch (error) {
      console.log("⚠️  更新前端配置失败:", error);
    }
  }

  /**
   * 执行完整部署流程
   */
  async deploy(): Promise<void> {
    try {
      await this.initializeDeployer();

      const lotteryAddress = await this.deployLottery();

      // 等待几个区块确认
      console.log("\n⏳ 等待区块确认...");
      await new Promise(resolve => setTimeout(resolve, 10000));

      await this.verifyContract(lotteryAddress, "Lottery");
      await this.updateFrontendConfig(lotteryAddress);

      console.log("\n🎉 部署完成!");
      console.log(`🌐 网络: ${this.networkName}`);
      console.log(`📍 Lottery 合约地址: ${lotteryAddress}`);
    } catch (error) {
      console.error("❌ 部署失败:", error);
      process.exit(1);
    }
  }
}

/**
 * 主函数
 */
async function main() {
  const hre = await import("hardhat");
  const networkName = process.argv[2] || "sepolia";

  // 检查网络是否支持
  const supportedNetworks = [
    "sepolia",
    "arbitrumSepolia",
    "optimismSepolia",
    "polygonAmoy",
    "baseSepolia",
    "scrollSepolia",
    "celoSepolia",
    "monad_testnet",
  ];

  if (!supportedNetworks.includes(networkName)) {
    console.error(`❌ 不支持的测试网: ${networkName}`);
    console.log(`✅ 支持的测试网: ${supportedNetworks.join(", ")}`);
    process.exit(1);
  }

  const deployer = new TestnetDeployer(hre, networkName);
  await deployer.deploy();
}

// 运行脚本
main().catch(error => {
  console.error(error);
  process.exit(1);
});
