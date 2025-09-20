# 🔑 私钥配置指南

## 📋 配置私钥的几种方式

### 方式 1: 直接配置私钥 (推荐)

编辑 `packages/hardhat/.env` 文件，添加以下内容：

```bash
# 部署者私钥 - 用于部署合约到 Monad Testnet
__RUNTIME_DEPLOYER_PRIVATE_KEY=你的私钥在这里

# 可选配置
ALCHEMY_API_KEY=你的_Alchemy_API_密钥
ETHERSCAN_V2_API_KEY=你的_Etherscan_API_密钥
```

### 方式 2: 生成新的测试账户

如果您没有私钥，可以生成一个新的测试账户：

```bash
cd packages/hardhat
yarn account:generate
```

然后按照提示输入密码，系统会生成一个新的账户。

### 方式 3: 导入现有私钥

如果您已有私钥，可以导入：

```bash
cd packages/hardhat
yarn account:import
```

## 🚨 重要安全提示

### ⚠️ 私钥安全
- **永远不要**将真实的私钥提交到代码仓库
- **永远不要**在公共场合分享私钥
- 建议使用测试网络的私钥，不要使用主网私钥

### 🔒 环境变量保护
- `.env` 文件已在 `.gitignore` 中，不会被提交
- 私钥只会存储在本地 `.env` 文件中
- 生产环境请使用更安全的密钥管理方案

## 📝 配置示例

### 完整的 .env 文件示例：

```bash
# 部署者私钥 (必需)
__RUNTIME_DEPLOYER_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# Alchemy API 密钥 (可选)
ALCHEMY_API_KEY=oKxs-03sij-U_N0iOlrSsZFr29-IqbuF

# Etherscan API 密钥 (可选)
ETHERSCAN_V2_API_KEY=DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW

# 主网分叉 (可选)
MAINNET_FORKING_ENABLED=false
```

## 🧪 测试私钥 (仅用于开发)

如果您只是想测试部署功能，可以使用以下测试私钥：

```bash
__RUNTIME_DEPLOYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**注意**: 这是 Hardhat 的默认测试私钥，仅用于本地开发和测试，不要在主网使用！

## 🚀 部署到 Monad Testnet

配置好私钥后，您就可以部署到 Monad Testnet 了：

```bash
# 部署合约
yarn deploy --network monadTestnet

# 验证部署
yarn verify --network monadTestnet
```

## 🔍 验证配置

您可以通过以下方式验证配置是否正确：

```bash
# 检查环境变量
cd packages/hardhat
node -e "require('dotenv').config(); console.log('Private Key:', process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY ? 'Set' : 'Not Set');"
```

## 📞 需要帮助？

如果您需要帮助配置私钥或有任何问题，请：

1. 确保私钥格式正确 (以 0x 开头的 64 位十六进制字符串)
2. 确保 .env 文件位于 `packages/hardhat/` 目录中
3. 确保环境变量名称正确 (`__RUNTIME_DEPLOYER_PRIVATE_KEY`)

---

**配置完成后，您就可以成功部署合约到 Monad Testnet 了！** 🎉
