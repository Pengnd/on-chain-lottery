#!/usr/bin/env ts-node

import * as dotenv from "dotenv";
dotenv.config();

/**
 * 使用示例脚本
 * 展示如何使用测试网部署脚本
 */

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    🎰 Lottery 合约部署示例                    ║
╚══════════════════════════════════════════════════════════════╝

📋 使用步骤:

1️⃣ 环境配置
   cd packages/hardhat
   cp env.template .env
   # 编辑 .env 文件，填入您的 API Key 和私钥

2️⃣ 获取测试代币
   # 访问水龙头获取测试网代币
   # Sepolia: https://sepoliafaucet.com/
   # Arbitrum Sepolia: https://faucet.quicknode.com/arbitrum/sepolia
   # 其他测试网水龙头请参考 TESTNET_DEPLOYMENT_GUIDE.md

3️⃣ 选择部署方式

   🚀 方式1: 快速部署 (推荐新手)
   yarn deploy:quick
   # 交互式选择测试网并部署

   🎯 方式2: 直接部署到指定测试网
   yarn deploy:sepolia                    # 部署到 Sepolia
   yarn deploy:arbitrum-sepolia          # 部署到 Arbitrum Sepolia
   yarn deploy:optimism-sepolia          # 部署到 Optimism Sepolia
   yarn deploy:polygon-amoy              # 部署到 Polygon Amoy
   yarn deploy:base-sepolia              # 部署到 Base Sepolia
   yarn deploy:scroll-sepolia            # 部署到 Scroll Sepolia
   yarn deploy:celo-sepolia              # 部署到 Celo Sepolia
   yarn deploy:monad-testnet             # 部署到 Monad 测试网

   🔧 方式3: 自定义部署
   yarn deploy:testnet <network_name>    # 部署到指定网络

4️⃣ 验证合约 (可选)
   yarn verify:all                       # 验证所有已部署的合约
   yarn verify:contract <network> <address> <name>  # 验证指定合约

5️⃣ 测试合约功能
   # 启动前端
   cd ../nextjs
   yarn start
   # 访问 http://localhost:3000/debug 测试合约

📚 更多信息:
   - 详细文档: TESTNET_DEPLOYMENT_GUIDE.md
   - 支持的测试网: 8个主流测试网
   - 自动验证: 支持自动合约验证
   - 错误处理: 完整的错误提示和故障排除

🎉 开始部署您的 Lottery 合约吧!
`);

// 显示当前环境状态
console.log(`
🔍 当前环境检查:
`);

// 检查环境变量
const hasAlchemyKey = !!process.env.ALCHEMY_API_KEY;
const hasEtherscanKey = !!process.env.ETHERSCAN_V2_API_KEY;
const hasPrivateKey = !!(process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY_ENCRYPTED);

console.log(`✅ Alchemy API Key: ${hasAlchemyKey ? '已配置' : '❌ 未配置'}`);
console.log(`✅ Etherscan API Key: ${hasEtherscanKey ? '已配置' : '❌ 未配置'}`);
console.log(`✅ 部署者私钥: ${hasPrivateKey ? '已配置' : '❌ 未配置'}`);

if (!hasAlchemyKey || !hasEtherscanKey || !hasPrivateKey) {
  console.log(`
❌ 环境配置不完整!
请按照以下步骤配置环境:

1. 复制环境变量模板:
   cp env.template .env

2. 编辑 .env 文件，填入:
   - ALCHEMY_API_KEY: 从 https://dashboard.alchemyapi.io 获取
   - ETHERSCAN_V2_API_KEY: 从 https://etherscan.io/apis 获取
   - 部署者私钥: 运行 yarn account:import 或直接设置

3. 重新运行此脚本检查配置
  `);
} else {
  console.log(`
✅ 环境配置完整! 可以开始部署了。

🚀 运行以下命令开始部署:
   yarn deploy:quick
  `);
}
