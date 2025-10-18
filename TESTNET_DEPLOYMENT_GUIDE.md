# 测试网部署指南

本指南将帮助您将 Lottery 合约部署到各种测试网络上。

## 📋 目录

- [准备工作](#准备工作)
- [环境配置](#环境配置)
- [部署步骤](#部署步骤)
- [支持的测试网](#支持的测试网)
- [常见问题](#常见问题)
- [故障排除](#故障排除)

## 🚀 准备工作

### 1. 安装依赖

```bash
# 在项目根目录运行
yarn install
```

### 2. 获取测试网代币

在部署之前，您需要获取测试网代币来支付 gas 费用。以下是各测试网的水龙头地址：

| 测试网 | 水龙头地址 | 代币符号 |
|--------|------------|----------|
| Sepolia | [sepoliafaucet.com](https://sepoliafaucet.com/) | ETH |
| Arbitrum Sepolia | [faucet.quicknode.com](https://faucet.quicknode.com/arbitrum/sepolia) | ETH |
| Optimism Sepolia | [faucet.optimism.io](https://faucet.optimism.io/) | ETH |
| Polygon Amoy | [faucet.polygon.technology](https://faucet.polygon.technology/) | MATIC |
| Base Sepolia | [faucet.quicknode.com](https://faucet.quicknode.com/base/sepolia) | ETH |
| Scroll Sepolia | [faucet.scroll.io](https://faucet.scroll.io/) | ETH |
| Celo Sepolia | [faucet.celo.org](https://faucet.celo.org/) | CELO |
| Monad Testnet | [testnet-faucet.monad.xyz](https://testnet-faucet.monad.xyz/) | MON |

## ⚙️ 环境配置

### 1. 复制环境变量模板

```bash
cd packages/hardhat
cp env.template .env
```

### 2. 配置环境变量

编辑 `.env` 文件，填入以下配置：

```bash
# 获取 Alchemy API Key: https://dashboard.alchemyapi.io
ALCHEMY_API_KEY="your_alchemy_api_key"

# 获取 Etherscan API Key: https://etherscan.io/apis
ETHERSCAN_V2_API_KEY="your_etherscan_api_key"

# 选择一种方式配置私钥
# 方式1: 使用加密私钥 (推荐)
DEPLOYER_PRIVATE_KEY_ENCRYPTED="your_encrypted_private_key"

# 方式2: 使用明文私钥 (不推荐)
__RUNTIME_DEPLOYER_PRIVATE_KEY="your_private_key"
```

### 3. 配置私钥

#### 方式1: 导入现有私钥 (推荐)

```bash
yarn account:import
```

#### 方式2: 生成新账户

```bash
yarn account:generate
```

#### 方式3: 直接设置明文私钥

```bash
# 在 .env 文件中设置
__RUNTIME_DEPLOYER_PRIVATE_KEY="0x你的私钥"
```

## 🚀 部署步骤

### 1. 编译合约

```bash
yarn compile
```

### 2. 运行测试 (可选)

```bash
yarn test
```

### 3. 部署到测试网

#### 使用通用命令

```bash
# 部署到指定测试网
yarn deploy:testnet <network_name>

# 示例
yarn deploy:testnet sepolia
yarn deploy:testnet arbitrumSepolia
```

#### 使用快捷命令

```bash
# Sepolia 测试网
yarn deploy:sepolia

# Arbitrum Sepolia 测试网
yarn deploy:arbitrum-sepolia

# Optimism Sepolia 测试网
yarn deploy:optimism-sepolia

# Polygon Amoy 测试网
yarn deploy:polygon-amoy

# Base Sepolia 测试网
yarn deploy:base-sepolia

# Scroll Sepolia 测试网
yarn deploy:scroll-sepolia

# Celo Sepolia 测试网
yarn deploy:celo-sepolia

# Monad 测试网
yarn deploy:monad-testnet
```

### 4. 验证合约 (可选)

```bash
# 验证所有已部署的合约
yarn verify:all

# 验证指定合约
yarn verify:contract <network> <contract_address> <contract_name>
```

## 🌐 支持的测试网

| 网络名称 | 链ID | RPC URL | 区块浏览器 |
|----------|------|---------|------------|
| sepolia | 11155111 | https://eth-sepolia.g.alchemy.com/v2/ | https://sepolia.etherscan.io |
| arbitrumSepolia | 421614 | https://arb-sepolia.g.alchemy.com/v2/ | https://sepolia.arbiscan.io |
| optimismSepolia | 11155420 | https://opt-sepolia.g.alchemy.com/v2/ | https://sepolia-optimism.etherscan.io |
| polygonAmoy | 80002 | https://polygon-amoy.g.alchemy.com/v2/ | https://amoy.polygonscan.com |
| baseSepolia | 84532 | https://sepolia.base.org | https://sepolia.basescan.org |
| scrollSepolia | 534351 | https://sepolia-rpc.scroll.io | https://sepolia.scrollscan.com |
| celoSepolia | 44787 | https://forno.celo-sepolia.celo-testnet.org/ | https://sepolia.celoscan.io |
| monad_testnet | 10143 | https://testnet-rpc.monad.xyz | https://testnet-explorer.monad.xyz |

## 🔧 常见问题

### Q: 部署失败，提示 "insufficient funds"

**A:** 您的账户余额不足，请从水龙头获取测试网代币。

### Q: 合约验证失败

**A:** 请检查：
1. Etherscan API Key 是否正确
2. 网络是否支持合约验证
3. 合约地址是否正确

### Q: 私钥解密失败

**A:** 请检查：
1. 密码是否正确
2. 加密私钥格式是否正确
3. 可以尝试重新导入私钥

### Q: 网络连接失败

**A:** 请检查：
1. Alchemy API Key 是否正确
2. 网络连接是否正常
3. RPC URL 是否可访问

## 🛠️ 故障排除

### 1. 检查网络连接

```bash
# 检查网络状态
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```

### 2. 检查账户余额

```bash
# 查看账户信息
yarn account
```

### 3. 查看部署日志

部署脚本会输出详细的日志信息，包括：
- 部署者地址
- 账户余额
- 合约地址
- 交易哈希
- 验证结果

### 4. 手动验证合约

如果自动验证失败，可以手动验证：

```bash
# 使用 Hardhat 验证
yarn hardhat-verify --network <network> <contract_address>

# 使用 Etherscan 验证
yarn verify --network <network> <contract_address>
```

## 📝 部署后操作

### 1. 更新前端配置

部署完成后，需要更新 `packages/nextjs/contracts/deployedContracts.ts` 文件，添加新部署的合约地址。

### 2. 测试合约功能

访问 `http://localhost:3000/lottery` 页面，使用抽签系统的各项功能。

### 3. 监控合约状态

使用区块浏览器监控合约的调用和事件。

## 🔒 安全提醒

1. **永远不要**将私钥提交到版本控制系统
2. **使用加密私钥**而不是明文私钥
3. **定期更换**API Key
4. **测试网代币**没有实际价值，仅用于测试

## 📞 获取帮助

如果遇到问题，可以：

1. 查看 [Scaffold-ETH 2 文档](https://docs.scaffoldeth.io/)
2. 检查 [Hardhat 文档](https://hardhat.org/docs)
3. 在项目 Issues 中提问

---

**祝您部署顺利！** 🎉

