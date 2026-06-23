import React from "react";
import PlayerDetail from "@/components/player/PlayerDetail";
import { useParams } from "react-router-dom";

const PlayerDetailPage = () => {
  // 使用 useParams 钩子获取路由参数
  const { id, nur } = useParams<{ id: string; nur?: string }>();
  const isNur = Boolean(parseInt(nur || "0"));

  return (
    <div className="flex flex-auto w-full flex-wrap max-w-6xl mx-auto">
      <PlayerDetail id={id!} isNur={isNur} page />
    </div>
  );
};

export default PlayerDetailPage;
