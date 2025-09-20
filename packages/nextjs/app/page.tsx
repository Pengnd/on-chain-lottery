"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // 直接重定向到抽签页面
    router.push("/lottery");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center text-white">
        <div className="text-6xl mb-4">🎲</div>
        <div className="loading loading-spinner loading-lg text-white"></div>
        <p className="mt-4 text-lg">正在跳转到抽签系统...</p>
      </div>
    </div>
  );
};

export default Home;
