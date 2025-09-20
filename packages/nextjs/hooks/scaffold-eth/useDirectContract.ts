import { useReadContract, useWriteContract, useChainId } from "wagmi";
import { useAccount } from "wagmi";

// Monad 测试网合约配置
const MONAD_CONTRACT_CONFIG = {
  address: "0xD94770d2F86CB0F7e06d995082A985Aa6d192D65" as const,
  abi: [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "lotteryId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        }
      ],
      "name": "LotteryCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "lotteryId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "participant",
          "type": "address"
        }
      ],
      "name": "ParticipantJoined",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "lotteryId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "winner",
          "type": "address"
        }
      ],
      "name": "WinnerSelected",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "durationSeconds",
          "type": "uint256"
        }
      ],
      "name": "createLottery",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "lotteryId",
          "type": "uint256"
        }
      ],
      "name": "getLotteryInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "address[]",
              "name": "participants",
              "type": "address[]"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "winner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "creator",
              "type": "address"
            }
          ],
          "internalType": "struct Lottery.LotteryInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllLotteries",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "lotteryIds",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "endTimes",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "participantCounts",
          "type": "uint256[]"
        },
        {
          "internalType": "bool[]",
          "name": "isActiveArray",
          "type": "bool[]"
        },
        {
          "internalType": "address[]",
          "name": "winners",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "lotteryId",
          "type": "uint256"
        }
      ],
      "name": "joinLottery",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextLotteryId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "lotteryId",
          "type": "uint256"
        }
      ],
      "name": "selectWinner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] as const,
  chainId: 10143,
};

/**
 * 直接调用 Monad 测试网合约的 Hook
 */
export const useDirectContract = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  
  // 检查是否连接到正确的网络
  const isCorrectNetwork = chainId === 10143;
  
  // 读取 nextLotteryId
  const { 
    data: nextLotteryId, 
    isLoading: isLoadingNextId, 
    error: nextIdError,
    refetch: refetchNextLotteryId 
  } = useReadContract({
    ...MONAD_CONTRACT_CONFIG,
    functionName: "nextLotteryId",
  });

  // 读取所有抽签
  const { 
    data: allLotteries, 
    isLoading: isLoadingLotteries, 
    error: lotteriesError,
    refetch: refetchLotteries 
  } = useReadContract({
    ...MONAD_CONTRACT_CONFIG,
    functionName: "getAllLotteries",
  });

  // 写入合约 - 使用 Scaffold-ETH 的 writeContract
  const { writeContractAsync: writeContractAsync } = useWriteContract();

  const createLottery = async (durationSeconds: bigint, retryCount = 0) => {
    // 检查网络连接
    if (!isCorrectNetwork) {
      throw new Error("请先切换到 Monad 测试网 (链ID: 10143)");
    }
    
    if (!address) {
      throw new Error("请先连接钱包");
    }
    
    try {
      console.log("🚀 开始创建抽签，持续时间:", durationSeconds.toString());
      console.log("🌐 当前网络链ID:", chainId);
      console.log("👤 钱包地址:", address);
      console.log("🔄 重试次数:", retryCount);
      
      // 尝试更简单的交易参数
      const txParams = {
        ...MONAD_CONTRACT_CONFIG,
        functionName: "createLottery",
        args: [durationSeconds],
      };
      
      console.log("📝 交易参数:", txParams);
      console.log("🔗 合约地址:", MONAD_CONTRACT_CONFIG.address);
      console.log("📋 函数名:", "createLottery");
      console.log("📊 参数:", [durationSeconds.toString()]);
      
      const result = await writeContractAsync(txParams);
      console.log("✅ 抽签创建成功，交易哈希:", result);
      return result;
    } catch (error: any) {
      console.error("❌ 创建抽签失败:", error);
      
      // 处理 Internal JSON-RPC error
      if (error.message?.includes("Internal JSON-RPC error")) {
        if (retryCount < 3) {
          console.log(`🔄 RPC 内部错误，等待 ${(retryCount + 1) * 2} 秒后重试...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
          return createLottery(durationSeconds, retryCount + 1);
        } else {
          throw new Error("RPC 服务暂时不可用，请稍后重试或刷新页面。");
        }
      }
      
      // 处理 Block tracker destroyed 错误
      if (error.message?.includes("Block tracker destroyed")) {
        if (retryCount < 3) {
          console.log(`🔄 Block tracker 被销毁，等待 ${(retryCount + 1) * 3} 秒后重试...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 3000));
          return createLottery(durationSeconds, retryCount + 1);
        } else {
          throw new Error("网络连接不稳定，请刷新页面后重试。");
        }
      }
      
      // 处理电路断路器错误 - 添加重试机制
      if (error.message?.includes("circuit breaker")) {
        if (retryCount < 3) {
          console.log(`🔄 电路断路器打开，等待 ${(retryCount + 1) * 2} 秒后重试...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
          return createLottery(durationSeconds, retryCount + 1);
        } else {
          throw new Error("网络繁忙，已重试多次。请稍后再试或检查网络连接。");
        }
      }
      
      // 处理其他错误
      if (error.message?.includes("insufficient funds")) {
        throw new Error("账户余额不足，请确保有足够的 MON 代币");
      }
      
      if (error.message?.includes("user rejected")) {
        throw new Error("用户取消了交易");
      }
      
      if (error.message?.includes("network")) {
        throw new Error("网络连接问题，请检查网络连接后重试");
      }
      
      throw error;
    }
  };

  const joinLottery = async (lotteryId: bigint) => {
    return writeContractAsync({
      ...MONAD_CONTRACT_CONFIG,
      functionName: "joinLottery",
      args: [lotteryId],
    });
  };

  const selectWinner = async (lotteryId: bigint) => {
    return writeContractAsync({
      ...MONAD_CONTRACT_CONFIG,
      functionName: "selectWinner",
      args: [lotteryId],
    });
  };

  return {
    // 读取数据
    nextLotteryId,
    isLoadingNextId,
    nextIdError,
    refetchNextLotteryId,
    
    allLotteries,
    isLoadingLotteries,
    lotteriesError,
    refetchLotteries,
    
    // 写入函数
    createLottery,
    joinLottery,
    selectWinner,
    
    // 合约配置
    contractConfig: MONAD_CONTRACT_CONFIG,
    
    // 网络状态
    isCorrectNetwork,
    chainId,
  };
};
