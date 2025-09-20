import * as dotenv from "dotenv";
dotenv.config();
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "ethers";

/**
 * 简化的 Monad 测试网部署脚本
 */
async function main() {
  const hre = require("hardhat");
  const networkName = "monad_testnet";
  
  console.log(`🚀 开始部署到 ${networkName} 测试网...`);
  
  // 获取部署者账户
  const [deployer] = await hre.ethers.getSigners();
  console.log(`💰 部署者地址: ${deployer.address}`);
  
  // 检查账户余额
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const balanceInEth = ethers.formatEther(balance);
  console.log(`💰 账户余额: ${balanceInEth} MON`);
  
  if (balance === 0n) {
    console.log("❌ 账户余额不足，请先获取测试网代币");
    console.log("💰 水龙头地址: https://testnet-faucet.monad.xyz/");
    process.exit(1);
  }
  
  // 部署 Lottery 合约
  console.log("\n📦 开始部署 Lottery 合约...");
  const Lottery = await hre.ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy();
  await lottery.waitForDeployment();
  
  const contractAddress = await lottery.getAddress();
  console.log(`✅ Lottery 合约部署成功!`);
  console.log(`📍 合约地址: ${contractAddress}`);
  console.log(`🔗 交易哈希: ${lottery.deploymentTransaction()?.hash}`);
  
  // 等待几个区块确认
  console.log("\n⏳ 等待区块确认...");
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // 尝试验证合约
  console.log("\n🔍 开始验证合约...");
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    console.log("✅ 合约验证成功!");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ 合约已经验证过了");
    } else {
      console.log("⚠️  合约验证失败:", error.message);
    }
  }
  
  console.log("\n🎉 部署完成!");
  console.log(`🌐 网络: ${networkName}`);
  console.log(`📍 Lottery 合约地址: ${contractAddress}`);
  console.log(`🔗 区块浏览器: https://testnet-explorer.monad.xyz/address/${contractAddress}`);
  
  // 更新前端配置提示
  console.log("\n📝 下一步:");
  console.log("1. 更新 packages/nextjs/contracts/deployedContracts.ts");
  console.log(`2. 将 ${networkName} 网络的 Lottery 合约地址更新为: ${contractAddress}`);
  console.log("3. 启动前端: cd ../nextjs && yarn start");
  console.log("4. 访问 http://localhost:3000/debug 测试合约");
}

// 运行脚本
main().catch((error) => {
  console.error("❌ 部署失败:", error);
  process.exit(1);
});
