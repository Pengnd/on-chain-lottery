# 🎲 链上即时抽签系统 (On-chain Real-time Lottery)

基于 **Monad Testnet** 的链上即时抽签系统，使用 Solidity + React 实现，支持创建抽签、参与抽签、开奖等完整功能。

## 📋 功能特性

### 智能合约功能
- ✅ **创建抽签**: 设置持续时间（最长7天）
- ✅ **参与抽签**: 用户可以在抽签结束前参与
- ✅ **开奖功能**: 基于区块哈希的公平随机选择
- ✅ **防重复参与**: 每个地址只能参与一次
- ✅ **完整事件**: 创建、参与、开奖事件记录

### 前端功能
- ✅ **现代化UI**: 使用 TailwindCSS + DaisyUI
- ✅ **实时更新**: 自动刷新抽签状态
- ✅ **响应式设计**: 支持移动端和桌面端
- ✅ **状态管理**: 清晰的抽签状态显示
- ✅ **用户友好**: 直观的操作界面

## 🚀 快速开始

### 1. 环境准备

确保已安装以下工具：
- Node.js (v18+)
- Yarn
- MetaMask 钱包

### 2. 安装依赖

```bash
# 安装项目依赖
yarn install
```

### 3. 配置网络

项目已配置 Monad Testnet：
- **Chain ID**: 421614
- **RPC URL**: https://testnet-rpc.monad.xyz/
- **Explorer**: https://testnet-explorer.monad.xyz

### 4. 部署智能合约

```bash
# 编译合约
yarn chain:compile

# 部署到 Monad Testnet
yarn deploy --network monadTestnet
```

### 5. 启动前端

```bash
# 启动开发服务器
yarn start
```

访问 http://localhost:3000/lottery 开始使用抽签系统。

## 📖 使用指南

### 创建抽签
1. 在"创建新抽签"区域输入持续时间（秒）
2. 点击"创建抽签"按钮
3. 确认 MetaMask 交易

### 参与抽签
1. 在抽签列表中找到想要参与的活动
2. 点击"参与抽签"按钮
3. 确认 MetaMask 交易

### 开奖
1. 等待抽签活动结束
2. 点击"开奖"按钮
3. 系统会自动选出中奖者

## 🔧 技术架构

### 智能合约
- **Solidity**: ^0.8.20
- **框架**: Hardhat
- **网络**: Monad Testnet

### 前端
- **框架**: Next.js 14 (App Router)
- **UI**: TailwindCSS + DaisyUI
- **Web3**: Scaffold-ETH 2 hooks
- **钱包**: RainbowKit + Wagmi

### 核心合约函数

```solidity
// 创建抽签
function createLottery(uint256 durationSeconds) external

// 参与抽签
function joinLottery(uint256 lotteryId) external

// 开奖
function drawWinner(uint256 lotteryId) external

// 查询抽签信息
function getLotteryInfo(uint256 lotteryId) external view returns (...)
```

## 🧪 测试

```bash
# 运行合约测试
yarn test

# 运行前端测试
yarn test:frontend
```

## 📁 项目结构

```
packages/
├── hardhat/
│   ├── contracts/
│   │   └── Lottery.sol          # 抽签合约
│   ├── deploy/
│   │   └── 01_deploy_lottery.ts # 部署脚本
│   └── test/
│       └── Lottery.ts           # 合约测试
└── nextjs/
    └── app/
        └── lottery/
            ├── page.tsx         # 主页面
            └── components/
                ├── CreateLottery.tsx  # 创建组件
                └── LotteryCard.tsx    # 抽签卡片
```

## 🔒 安全特性

- **随机性保证**: 使用区块哈希 + 时间戳确保公平性
- **防重复参与**: 智能合约层面防止重复参与
- **时间验证**: 严格的时间检查确保规则执行
- **状态管理**: 完整的抽签状态跟踪

## 🌐 网络配置

### Monad Testnet 详细信息
- **Chain ID**: 421614
- **Currency**: MON (Monad)
- **Block Time**: ~1秒
- **Gas Limit**: 30M
- **RPC**: https://testnet-rpc.monad.xyz/

### 添加网络到 MetaMask
1. 打开 MetaMask
2. 点击网络下拉菜单
3. 选择"添加网络"
4. 输入以下信息：
   - 网络名称: Monad Testnet
   - RPC URL: https://testnet-rpc.monad.xyz/
   - Chain ID: 421614
   - Currency Symbol: MON
   - Block Explorer: https://testnet-explorer.monad.xyz

## 💡 获取测试币

访问 [Monad 官方水龙头](https://gmonad.cc/testnet) 获取测试代币。

## 🐛 故障排除

### 常见问题

1. **交易失败**
   - 检查钱包余额是否足够支付 Gas 费
   - 确认网络设置为 Monad Testnet

2. **无法连接钱包**
   - 确保 MetaMask 已安装并解锁
   - 检查网络配置是否正确

3. **合约调用失败**
   - 确认合约已正确部署
   - 检查函数参数是否正确

### 调试模式

访问 http://localhost:3000/debug 查看合约交互界面。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请通过以下方式联系：
- GitHub Issues
- 项目讨论区

---

**注意**: 这是一个演示项目，仅用于学习和测试目的。在生产环境中使用前，请进行充分的安全审计。
