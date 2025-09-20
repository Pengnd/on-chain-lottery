const { ethers } = require("hardhat");

async function testContract() {
  try {
    // 获取合约实例
    const lottery = await ethers.getContractAt("Lottery", "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9");
    
    console.log("🎯 测试合约连接...");
    
    // 读取 nextLotteryId
    const nextLotteryId = await lottery.nextLotteryId();
    console.log("📊 当前抽签ID数量:", nextLotteryId.toString());
    
    if (nextLotteryId > 0) {
      // 获取第一个抽签的信息
      const lotteryInfo = await lottery.getLotteryInfo(0);
      console.log("📋 抽签 #0 信息:");
      console.log("  - 结束时间:", new Date(Number(lotteryInfo[0]) * 1000).toLocaleString());
      console.log("  - 参与人数:", lotteryInfo[1].toString());
      console.log("  - 是否活跃:", lotteryInfo[2]);
      console.log("  - 中奖者:", lotteryInfo[3]);
      console.log("  - 创建者:", lotteryInfo[4]);
    }
    
    console.log("✅ 合约连接测试成功！");
    
  } catch (error) {
    console.error("❌ 合约连接测试失败:", error.message);
  }
}

testContract();
