import React from "react";
import SupportDetail from "@/components/support/SupportDetail";
import { useParams } from "react-router-dom";

const SupportDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-auto w-full flex-wrap max-w-6xl mx-auto">
      <SupportDetail id={id} page />
    </div>
  );
};

export default SupportDetailPage;
