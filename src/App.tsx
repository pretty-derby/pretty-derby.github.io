import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/common/Layout";
import { useDB } from "./hooks/useDB";

// 使用 lazy 动态导入组件
const Race = lazy(() => import("@/react-pages/race"));
const Player = lazy(() => import("@/react-pages/player"));
const Support = lazy(() => import("@/react-pages/support"));
const Nurturing = lazy(() => import("@/react-pages/nurturing"));
const Skill = lazy(() => import("@/react-pages/skill"));
const Seed = lazy(() => import("@/react-pages/seed"));
const NurturingMO = lazy(() => import("@/react-pages/nurturingMo"));
const SeedMo = lazy(() => import("@/react-pages/seedMo"));
const SupportDetailPage = lazy(() => import("@/react-pages/support/detail"));
const PlayerDetailPage = lazy(() => import("@/react-pages/player/detail"));
const SkillDetailPage = lazy(() => import("@/react-pages/skill/detail"));
const BuffList = lazy(() => import("@/components/buff"));

const App = () => {
  const { db, loading } = useDB();

  if (loading) return <div>Loading database...</div>;
  if (!db) return <div>Failed to load database.</div>;

  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Player />} />
          <Route path="/support" element={<Support />} />
          <Route path="/skill" element={<Skill />} />
          <Route path="/nurturing" element={<Nurturing />} />
          <Route path="/nurturingMo" element={<NurturingMO />} />
          <Route path="/seed" element={<Seed />} />
          <Route path="/SeedMo" element={<SeedMo />} />
          <Route path="/race" element={<Race />} />
          <Route path="/support-detail/:id" element={<SupportDetailPage />} />
          <Route path="/support-detail/:id/:nur" element={<SupportDetailPage />} />
          <Route path="/player-detail/:id" element={<PlayerDetailPage />} />
          <Route path="/player-detail/:id/:nur" element={<PlayerDetailPage />} />
          <Route path="/skill-detail/:id" element={<SkillDetailPage />} />
          <Route path="/buff" element={<BuffList />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
