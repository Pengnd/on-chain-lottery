#!/usr/bin/env ts-node

import * as dotenv from "dotenv";
dotenv.config();
import { spawn } from "child_process";
import inquirer from "inquirer";

/**
 * 快速部署脚本
 * 提供交互式界面选择测试网并部署
 */

interface NetworkOption {
  name: string;
  value: string;
  description: string;
  faucet: string;
}

const networks: NetworkOption[] = [
  {
    name: "Sepolia (以太坊测试网)",
    value: "sepolia",
    description: "以太坊官方测试网",
    faucet: "https://sepoliafaucet.com/"
  },
  {
    name: "Arbitrum Sepolia",
    value: "arbitrumSepolia", 
    description: "Arbitrum Layer 2 测试网",
    faucet: "https://faucet.quicknode.com/arbitrum/sepolia"
  },
  {
    name: "Optimism Sepolia",
    value: "optimismSepolia",
    description: "Optimism Layer 2 测试网", 
    faucet: "https://faucet.optimism.io/"
  },
  {
    name: "Polygon Amoy",
    value: "polygonAmoy",
    description: "Polygon 测试网",
    faucet: "https://faucet.polygon.technology/"
  },
  {
    name: "Base Sepolia",
    value: "baseSepolia",
    description: "Base Layer 2 测试网",
    faucet: "https://faucet.quicknode.com/base/sepolia"
  },
  {
    name: "Scroll Sepolia",
    value: "scrollSepolia",
    description: "Scroll Layer 2 测试网",
    faucet: "https://faucet.scroll.io/"
  },
  {
    name: "Celo Sepolia",
    value: "celoSepolia",
    description: "Celo 测试网",
    faucet: "https://faucet.celo.org/"
  },
  {
    name: "Monad Testnet",
    value: "monad_testnet",
    description: "Monad 测试网",
    faucet: "https://testnet-faucet.monad.xyz/"
  }
];

/**
 * 显示欢迎信息
 */
function showWelcome() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    🎰 Lottery 合约部署工具                    ║
║                                                              ║
║  本工具将帮助您将 Lottery 合约部署到各种测试网络              ║
║                                                              ║
║  📋 部署前请确保:                                             ║
║     • 已配置环境变量 (.env 文件)                              ║
║     • 已获取测试网代币 (从水龙头)                             ║
║     • 已配置部署者私钥                                        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `);
}

/**
 * 检查环境配置
 */
async function checkEnvironment(): Promise<boolean> {
  console.log("\n🔍 检查环境配置...");
  
  const hasAlchemyKey = !!process.env.ALCHEMY_API_KEY;
  const hasEtherscanKey = !!process.env.ETHERSCAN_V2_API_KEY;
  const hasPrivateKey = !!(process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY_ENCRYPTED);
  
  console.log(`✅ Alchemy API Key: ${hasAlchemyKey ? '已配置' : '❌ 未配置'}`);
  console.log(`✅ Etherscan API Key: ${hasEtherscanKey ? '已配置' : '❌ 未配置'}`);
  console.log(`✅ 部署者私钥: ${hasPrivateKey ? '已配置' : '❌ 未配置'}`);
  
  if (!hasAlchemyKey || !hasEtherscanKey || !hasPrivateKey) {
    console.log("\n❌ 环境配置不完整，请检查 .env 文件");
    console.log("📖 参考文档: TESTNET_DEPLOYMENT_GUIDE.md");
    return false;
  }
  
  return true;
}

/**
 * 选择测试网
 */
async function selectNetwork(): Promise<string> {
  const { network } = await inquirer.prompt([
    {
      type: "list",
      name: "network",
      message: "请选择要部署的测试网:",
      choices: networks.map(net => ({
        name: `${net.name} - ${net.description}`,
        value: net.value
      }))
    }
  ]);
  
  return network;
}

/**
 * 显示水龙头信息
 */
function showFaucetInfo(network: string) {
  const selectedNetwork = networks.find(net => net.value === network);
  if (selectedNetwork) {
    console.log(`\n💰 获取测试代币:`);
    console.log(`   水龙头地址: ${selectedNetwork.faucet}`);
    console.log(`   请确保您的账户有足够的测试代币来支付 gas 费用`);
  }
}

/**
 * 确认部署
 */
async function confirmDeployment(network: string): Promise<boolean> {
  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: `确认要部署到 ${network} 测试网吗?`,
      default: true
    }
  ]);
  
  return confirm;
}

/**
 * 执行部署
 */
async function executeDeployment(network: string): Promise<void> {
  console.log(`\n🚀 开始部署到 ${network} 测试网...`);
  
  return new Promise((resolve, reject) => {
    const deployProcess = spawn("yarn", ["deploy:testnet", network], {
      stdio: "inherit",
      shell: true
    });
    
    deployProcess.on("close", (code) => {
      if (code === 0) {
        console.log("\n🎉 部署完成!");
        resolve();
      } else {
        console.log(`\n❌ 部署失败，退出码: ${code}`);
        reject(new Error(`部署失败，退出码: ${code}`));
      }
    });
    
    deployProcess.on("error", (error) => {
      console.log(`\n❌ 部署过程中发生错误: ${error.message}`);
      reject(error);
    });
  });
}

/**
 * 主函数
 */
async function main() {
  try {
    showWelcome();
    
    // 检查环境配置
    const envOk = await checkEnvironment();
    if (!envOk) {
      process.exit(1);
    }
    
    // 选择测试网
    const network = await selectNetwork();
    
    // 显示水龙头信息
    showFaucetInfo(network);
    
    // 确认部署
    const confirmed = await confirmDeployment(network);
    if (!confirmed) {
      console.log("❌ 部署已取消");
      process.exit(0);
    }
    
    // 执行部署
    await executeDeployment(network);
    
  } catch (error) {
    console.error("\n❌ 发生错误:", error);
    process.exit(1);
  }
}

// 运行脚本
main();

