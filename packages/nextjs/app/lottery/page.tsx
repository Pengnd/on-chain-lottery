"use client";

import { useEffect, useState } from "react";
import CreateLotteryModal from "./components/CreateLotteryModal";
import LotteryDetailModal from "./components/LotteryDetailModal";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

/**
 * 抽签活动信息接口
 */
interface LotteryInfo {
  lotteryId: number;
  endTime: bigint;
  participantCount: number;
  isActive: boolean;
  winner: string;
  creator: string;
}

/**
 * 链上即时抽签系统主页面
 */
export default function LotteryPage() {
  const [, setLotteryCount] = useState<number>(0);
  const [lotteries, setLotteries] = useState<LotteryInfo[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedLottery, setSelectedLottery] = useState<LotteryInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 读取下一个抽签ID
  const { data: nextLotteryId } = useScaffoldReadContract({
    contractName: "Lottery",
    functionName: "nextLotteryId",
  });

  // 写入合约
  const { writeContractAsync: writeLotteryAsync } = useScaffoldWriteContract({
    contractName: "Lottery",
  });

  // 更新抽签数量
  useEffect(() => {
    if (nextLotteryId) {
      setLotteryCount(Number(nextLotteryId));
    }
  }, [nextLotteryId]);

  // 组件加载时获取抽签信息
  useEffect(() => {
    const fetchLotteries = async () => {
      if (!nextLotteryId) return;

      const lotteryCount = Number(nextLotteryId);
      const lotteryData: LotteryInfo[] = [];

      // 模拟数据，实际应用中应该使用合约读取
      for (let i = 0; i < lotteryCount; i++) {
        lotteryData.push({
          lotteryId: i,
          endTime: BigInt(Date.now() + (i + 1) * 3600000), // 模拟不同的结束时间
          participantCount: Math.floor(Math.random() * 10),
          isActive: true,
          winner: "0x0000000000000000000000000000000000000000",
          creator: "0x1234567890123456789012345678901234567890",
        });
      }

      setLotteries(lotteryData);
    };

    fetchLotteries();
  }, [nextLotteryId]);

  /**
   * 抽签创建后的回调
   */
  const handleLotteryCreated = () => {
    setShowCreateModal(false);
    // 重新获取抽签列表
    window.location.reload();
  };

  /**
   * 参与抽签
   */
  const handleJoinLottery = async (lotteryId: number) => {
    setLoading(true);
    try {
      await writeLotteryAsync({
        functionName: "joinLottery",
        args: [BigInt(lotteryId)],
      });
      alert("成功参与抽签！");
      window.location.reload();
    } catch (error) {
      console.error("参与抽签失败:", error);
      alert("参与抽签失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 开奖
   */
  const handleDrawWinner = async (lotteryId: number) => {
    setLoading(true);
    try {
      await writeLotteryAsync({
        functionName: "drawWinner",
        args: [BigInt(lotteryId)],
      });
      alert("开奖成功！");
      window.location.reload();
    } catch (error) {
      console.error("开奖失败:", error);
      alert("开奖失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 格式化时间显示
   */
  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString("zh-CN");
  };

  /**
   * 检查抽签是否已结束
   */
  const isLotteryEnded = (endTime: bigint) => {
    return Date.now() / 1000 > Number(endTime);
  };

  /**
   * 获取状态文本
   */
  const getStatusText = (lottery: LotteryInfo) => {
    const ended = isLotteryEnded(lottery.endTime);
    const hasWinner = lottery.winner !== "0x0000000000000000000000000000000000000000";

    if (hasWinner) {
      return "已开奖";
    } else if (ended) {
      return "已结束";
    } else {
      return "进行中";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* 顶部标题栏 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🎲 链上即时抽签系统
            </h1>
            <p className="text-gray-300 mt-2 text-lg">基于 Monad Testnet 的公平透明抽签平台</p>
          </div>
          <button
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            onClick={() => setShowCreateModal(true)}
          >
            <span className="text-lg mr-2">✨</span>
            创建新抽签
          </button>
        </div>

        {/* 抽签活动表格 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">📋</span>
              抽签活动列表
            </h2>

            {lotteries.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-8xl mb-6">🎯</div>
                <p className="text-white text-xl mb-2">暂无抽签活动</p>
                <p className="text-gray-300 text-sm">点击&ldquo;创建新抽签&rdquo;开始第一个活动！</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-4 px-2 font-semibold text-purple-300">Lottery ID</th>
                      <th className="text-left py-4 px-2 font-semibold text-purple-300">截止时间</th>
                      <th className="text-left py-4 px-2 font-semibold text-purple-300">参与人数</th>
                      <th className="text-left py-4 px-2 font-semibold text-purple-300">状态</th>
                      <th className="text-left py-4 px-2 font-semibold text-purple-300">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lotteries.map(lottery => (
                      <tr
                        key={lottery.lotteryId}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-2 font-mono text-purple-200">#{lottery.lotteryId}</td>
                        <td className="py-4 px-2 text-gray-200">{formatTime(lottery.endTime)}</td>
                        <td className="py-4 px-2">
                          <span className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm">
                            {lottery.participantCount} 人
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              getStatusText(lottery) === "进行中"
                                ? "bg-green-500/20 text-green-200"
                                : getStatusText(lottery) === "已结束"
                                  ? "bg-yellow-500/20 text-yellow-200"
                                  : "bg-blue-500/20 text-blue-200"
                            }`}
                          >
                            {getStatusText(lottery)}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex gap-2">
                            {!isLotteryEnded(lottery.endTime) &&
                              lottery.winner === "0x0000000000000000000000000000000000000000" && (
                                <button
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg"
                                  onClick={() => handleJoinLottery(lottery.lotteryId)}
                                  disabled={loading}
                                >
                                  参加
                                </button>
                              )}

                            {isLotteryEnded(lottery.endTime) &&
                              lottery.participantCount > 0 &&
                              lottery.winner === "0x0000000000000000000000000000000000000000" && (
                                <button
                                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg"
                                  onClick={() => handleDrawWinner(lottery.lotteryId)}
                                  disabled={loading}
                                >
                                  开奖
                                </button>
                              )}

                            <button
                              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-white/20"
                              onClick={() => setSelectedLottery(lottery)}
                            >
                              详情
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* 创建抽签弹窗 */}
        {showCreateModal && (
          <CreateLotteryModal onClose={() => setShowCreateModal(false)} onSuccess={handleLotteryCreated} />
        )}

        {/* 抽签详情弹窗 */}
        {selectedLottery && (
          <LotteryDetailModal
            lottery={selectedLottery}
            onClose={() => setSelectedLottery(null)}
            onJoin={() => {
              handleJoinLottery(selectedLottery.lotteryId);
              setSelectedLottery(null);
            }}
            onDraw={() => {
              handleDrawWinner(selectedLottery.lotteryId);
              setSelectedLottery(null);
            }}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
