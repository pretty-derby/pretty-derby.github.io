import React from "react";
import SkillDetail from "@/components/skill/SkillDetail";
import { useParams } from "react-router-dom";

const SkillDetailPage = () => {
  const { id, nur } = useParams<{ id: string; nur?: string }>();
  const isNur = Boolean(parseInt(nur || "0"));

  return <SkillDetail id={id} isNur={isNur} page />;
};

export default SkillDetailPage;
