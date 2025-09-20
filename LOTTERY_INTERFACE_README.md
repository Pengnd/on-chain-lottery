# 🎲 链上即时抽签系统 - 界面设计文档

## 📋 项目概述

基于 **Monad Testnet** 的链上即时抽签系统，使用 **React + TailwindCSS + ethers.js** 实现现代化前端界面。

## 🎨 界面设计

### 1. 首页 (Lottery 列表页)

**布局特点：**
- 顶部标题栏：`🪄 On-chain Lottery System (Monad Testnet)`
- 右侧创建按钮：`[创建新抽签]`
- 抽签活动表格展示

**表格结构：**
```
| Lottery ID | 截止时间 | 参与人数 | 状态 | 操作 |
|------------|----------|----------|------|------|
| #0         | 2024-01-20 15:30 | 5 人 | 进行中 | [参加] [详情] |
| #1         | 2024-01-20 16:00 | 3 人 | 已结束 | [开奖] [详情] |
```

**状态标识：**
- 🟢 **进行中** - 可以参与抽签
- 🟡 **已结束** - 等待开奖
- 🔴 **已开奖** - 显示中奖者

### 2. 创建抽签弹窗

**功能特点：**
- 弹窗标题：`🆕 创建新抽签活动`
- 持续时间输入框（秒）
- 快速选择按钮：1分钟、5分钟、30分钟、1小时、6小时、1天
- 时间预览功能
- 确认创建按钮

**交互流程：**
1. 点击"创建新抽签"按钮
2. 输入持续时间或选择预设时间
3. 查看结束时间预览
4. 点击"确认创建"
5. 调用 `createLottery(duration)` 合约方法

### 3. 抽签详情弹窗

**信息展示：**
- ⏰ **截止时间** - 精确到秒的倒计时
- 👥 **参与人数** - 实时更新
- 👤 **创建者** - 显示创建者地址
- 👥 **参与者列表** - 显示前10个参与者，支持滚动
- 🏆 **中奖结果** - 未开奖显示"还未开奖"，已开奖显示中奖者

**操作按钮：**
- `[参加抽签]` - 调用 `joinLottery(lotteryId)`
- `[开奖]` - 调用 `drawWinner(lotteryId)`
- `[返回首页]` - 关闭详情弹窗

### 4. 开奖结果展示

**结果页面特点：**
- 🎉 中奖者地址展示
- 中奖者徽章标识
- 返回首页按钮

## 🛠️ 技术实现

### 组件架构

```
src/
├── app/lottery/
│   ├── page.tsx                    # 主页面
│   └── components/
│       ├── CreateLotteryModal.tsx  # 创建抽签弹窗
│       └── LotteryDetailModal.tsx  # 抽签详情弹窗
```

### 状态管理

```typescript
interface LotteryInfo {
  lotteryId: number;
  endTime: bigint;
  participantCount: number;
  isActive: boolean;
  winner: string;
  creator: string;
}
```

### 合约交互

**使用的合约方法：**
- `createLottery(uint256 duration)` - 创建抽签
- `joinLottery(uint256 lotteryId)` - 参与抽签
- `drawWinner(uint256 lotteryId)` - 开奖
- `getLotteryInfo(uint256 lotteryId)` - 获取抽签信息
- `getParticipants(uint256 lotteryId)` - 获取参与者列表
- `hasParticipated(uint256 lotteryId, address participant)` - 检查是否已参与

### UI 组件库

**使用的 TailwindCSS 组件：**
- `table table-zebra` - 斑马纹表格
- `modal modal-box` - 弹窗组件
- `badge` - 状态徽章
- `btn btn-*` - 按钮组件
- `card card-body` - 卡片布局
- `alert alert-*` - 提示信息

## 🎯 用户体验设计

### 1. 视觉层次
- 清晰的信息层级
- 一致的色彩系统
- 合理的间距布局

### 2. 交互反馈
- 按钮加载状态
- 操作成功提示
- 错误信息展示

### 3. 响应式设计
- 移动端适配
- 表格横向滚动
- 弹窗自适应大小

### 4. 实时更新
- 自动刷新数据
- 状态实时变化
- 倒计时显示

## 🚀 部署和运行

### 1. 开发环境启动

```bash
# 安装依赖
yarn install

# 启动本地区块链
yarn chain

# 部署合约
yarn deploy

# 启动前端
yarn start
```

### 2. 访问应用

打开浏览器访问：`http://localhost:3000/lottery`

### 3. 网络配置

确保 MetaMask 配置了 Monad Testnet：
- **Chain ID**: 421614
- **RPC URL**: https://testnet-rpc.monad.xyz/
- **Currency**: MON

## 📱 界面截图说明

### 首页表格视图
- 清晰的表格布局
- 状态颜色区分
- 操作按钮分组

### 创建抽签弹窗
- 简洁的表单设计
- 预设时间选项
- 实时预览功能

### 详情页面
- 信息卡片布局
- 参与者列表展示
- 中奖结果突出显示

## 🔧 自定义配置

### 1. 主题定制
修改 `tailwind.config.js` 中的颜色配置

### 2. 组件样式
调整 `globals.css` 中的自定义样式

### 3. 合约地址
更新 `scaffold.config.ts` 中的合约地址

## 📈 性能优化

### 1. 数据缓存
- 使用 React hooks 缓存合约数据
- 减少不必要的合约调用

### 2. 组件优化
- 使用 React.memo 避免重复渲染
- 懒加载大型组件

### 3. 网络优化
- 批量获取数据
- 错误重试机制

## 🐛 故障排除

### 常见问题

1. **合约调用失败**
   - 检查网络连接
   - 确认钱包余额
   - 验证合约地址

2. **界面显示异常**
   - 清除浏览器缓存
   - 检查控制台错误
   - 重新加载页面

3. **数据不同步**
   - 手动刷新页面
   - 检查区块链网络
   - 确认交易状态

## 📞 技术支持

如有问题，请通过以下方式联系：
- GitHub Issues
- 项目讨论区
- 技术文档

---

**注意**: 这是一个演示项目，界面设计遵循现代化 Web 应用的最佳实践，提供良好的用户体验和交互反馈。
