"use client";

import { useEffect, useState } from "react";
import { Address } from "~~/components/scaffold-eth";
import { useDirectContract } from "~~/hooks/scaffold-eth/useDirectContract";

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
 * 抽签详情弹窗组件属性
 */
interface LotteryDetailModalProps {
  lottery: LotteryInfo;
  onClose: () => void;
  onJoin: () => void;
  onDraw: () => void;
  loading: boolean;
}

/**
 * 抽签详情弹窗组件
 */
export default function LotteryDetailModal({ lottery, onClose, onJoin, onDraw, loading }: LotteryDetailModalProps) {
  const [participants, setParticipants] = useState<string[]>([]);
  const [hasParticipated, setHasParticipated] = useState<boolean>(false);

  // 使用直接调用合约的 hook
  const { allLotteries } = useDirectContract();

  // 从 allLotteries 中获取参与者数据
  const participantsData = allLotteries && allLotteries[2] ? allLotteries[2][lottery.lotteryId] : 0;

  // 更新参与者数据
  useEffect(() => {
    // 由于 allLotteries 只返回参与者数量，我们使用模拟数据
    // 在实际应用中，如果需要详细的参与者列表，需要调用单独的合约函数
    if (participantsData && typeof participantsData === "number") {
      // 创建模拟的参与者地址列表
      const mockParticipants = Array.from(
        { length: participantsData },
        () => `0x${Math.random().toString(16).substr(2, 40)}`,
      );
      setParticipants(mockParticipants);
    }
  }, [participantsData]);

  // 更新参与状态 - 暂时设为 false，实际应用中需要从合约读取
  useEffect(() => {
    setHasParticipated(false);
  }, []);

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
   * 获取剩余时间
   */
  const getRemainingTime = (endTime: bigint) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = Number(endTime) - now;

    if (remaining <= 0) return "已结束";

    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;

    if (hours > 0) {
      return `${hours}小时${minutes}分钟${seconds}秒`;
    } else if (minutes > 0) {
      return `${minutes}分钟${seconds}秒`;
    } else {
      return `${seconds}秒`;
    }
  };

  const ended = isLotteryEnded(lottery.endTime);
  const hasWinner = lottery.winner !== "0x0000000000000000000000000000000000000000";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="modal-box w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 弹窗标题 */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">🎲 抽签详情 #{lottery.lotteryId}</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* 基本信息 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-base-200">
              <div className="card-body">
                <h4 className="card-title text-lg">⏰ 截止时间</h4>
                <p className="text-sm text-base-content/70">{formatTime(lottery.endTime)}</p>
                <div className="badge badge-info">{ended ? "已结束" : getRemainingTime(lottery.endTime)}</div>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body">
                <h4 className="card-title text-lg">👥 参与人数</h4>
                <p className="text-2xl font-bold text-primary">{lottery.participantCount}</p>
                <div className="text-sm text-base-content/70">人已参与</div>
              </div>
            </div>
          </div>

          {/* 创建者信息 */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="card-title text-lg">👤 创建者</h4>
              <Address address={lottery.creator} />
            </div>
          </div>

          {/* 参与者列表 */}
          {participants.length > 0 && (
            <div className="card bg-base-200">
              <div className="card-body">
                <h4 className="card-title text-lg">👥 参与者列表</h4>
                <div className="max-h-48 overflow-y-auto">
                  <div className="space-y-2">
                    {participants.slice(0, 10).map((participant, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-base-100 rounded">
                        <div className="flex items-center gap-2">
                          <span className="badge badge-neutral">#{index + 1}</span>
                          <Address address={participant} />
                        </div>
                        {participant === lottery.winner && <span className="badge badge-success">🏆 中奖者</span>}
                      </div>
                    ))}
                    {participants.length > 10 && (
                      <div className="text-center text-sm text-base-content/50">
                        ... 还有 {participants.length - 10} 位参与者
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 中奖结果 */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="card-title text-lg">🏆 中奖结果</h4>
              {hasWinner ? (
                <div className="text-center">
                  <div className="text-4xl mb-2">🎉</div>
                  <div className="text-lg font-bold text-success mb-2">中奖者</div>
                  <Address address={lottery.winner} />
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl mb-2">⏳</div>
                  <p className="text-base-content/70">还未开奖</p>
                </div>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-center gap-4">
            {!ended && !hasParticipated && !hasWinner && (
              <button className="btn btn-success btn-lg" onClick={onJoin} disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    参与中...
                  </>
                ) : (
                  "参加抽签"
                )}
              </button>
            )}

            {hasParticipated && !ended && <div className="badge badge-info badge-lg">✅ 已参与</div>}

            {ended && lottery.participantCount > 0 && !hasWinner && (
              <button className="btn btn-warning btn-lg" onClick={onDraw} disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    开奖中...
                  </>
                ) : (
                  "开奖"
                )}
              </button>
            )}

            {ended && lottery.participantCount === 0 && <div className="badge badge-ghost badge-lg">无参与者</div>}
          </div>

          {/* 返回按钮 */}
          <div className="flex justify-center">
            <button className="btn btn-outline" onClick={onClose}>
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
