"use client";

import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

/**
 * 创建抽签弹窗组件属性
 */
interface CreateLotteryModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * 创建抽签弹窗组件
 */
export default function CreateLotteryModal({ onClose, onSuccess }: CreateLotteryModalProps) {
  const [duration, setDuration] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // 写入合约
  const { writeContractAsync: writeLotteryAsync } = useScaffoldWriteContract({
    contractName: "Lottery",
  });

  /**
   * 创建新的抽签活动
   */
  const handleCreateLottery = async () => {
    if (!duration || Number(duration) <= 0) {
      alert("请输入有效的持续时间（秒）");
      return;
    }

    if (Number(duration) > 604800) {
      alert("持续时间不能超过7天（604800秒）");
      return;
    }

    setLoading(true);
    try {
      await writeLotteryAsync({
        functionName: "createLottery",
        args: [BigInt(duration)],
      });
      alert("抽签活动创建成功！");
      onSuccess();
    } catch (error) {
      console.error("创建抽签失败:", error);
      alert("创建抽签失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 预设时间选项
   */
  const timePresets = [
    { label: "1分钟", value: "60" },
    { label: "5分钟", value: "300" },
    { label: "30分钟", value: "1800" },
    { label: "1小时", value: "3600" },
    { label: "6小时", value: "21600" },
    { label: "1天", value: "86400" },
  ];

  /**
   * 格式化时间预览
   */
  const formatTimePreview = (seconds: string) => {
    if (!seconds || Number(seconds) <= 0) return "";

    const totalSeconds = Number(seconds);
    const endTime = new Date(Date.now() + totalSeconds * 1000);
    return endTime.toLocaleString("zh-CN");
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-800 to-purple-900 rounded-2xl shadow-2xl w-11/12 max-w-md border border-white/20">
        {/* 弹窗标题 */}
        <div className="flex justify-between items-center p-6 border-b border-white/20">
          <h3 className="text-2xl font-bold text-white">🆕 创建新抽签活动</h3>
          <button className="text-white/70 hover:text-white text-2xl font-bold transition-colors" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* 表单内容 */}
        <div className="p-6 space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white font-medium">持续时间（秒）</span>
            </label>
            <input
              type="number"
              placeholder="例如：3600（1小时）"
              className="input bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:bg-white/20"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              min="1"
              max="604800"
            />
            <div className="label">
              <span className="label-text-alt text-white/60">最长7天（604800秒）</span>
            </div>
          </div>

          {/* 预设时间按钮 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white font-medium">快速选择</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {timePresets.map(preset => (
                <button
                  key={preset.value}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-white/20"
                  onClick={() => setDuration(preset.value)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 时间预览 */}
          {duration && Number(duration) > 0 && (
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="text-blue-300 text-xl">⏰</div>
                <div>
                  <div className="font-bold text-blue-200">结束时间预览</div>
                  <div className="text-sm text-blue-100">{formatTimePreview(duration)}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 按钮区域 */}
        <div className="flex justify-end gap-4 p-6 border-t border-white/20">
          <button
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-white/20"
            onClick={onClose}
            disabled={loading}
          >
            取消
          </button>
          <button
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            onClick={handleCreateLottery}
            disabled={loading || !duration}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                创建中...
              </>
            ) : (
              "确认创建"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
