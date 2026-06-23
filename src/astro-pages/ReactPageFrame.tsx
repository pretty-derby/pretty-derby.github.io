import React from "react";
import { BrowserRouter } from "react-router-dom";

import Layout from "@/components/common/Layout";
import { useDB } from "@/hooks/useDB";
import { getRouterBasename } from "@/lib/locale";
import "@/styles/index.css";
import "@/styles/old.css";
import "@/i18n";

const ReactPageFrame = ({ Page }: { Page: React.ComponentType }) => {
  const { db, loading } = useDB();

  if (loading) return <div>Loading database...</div>;
  if (!db) return <div>Failed to load database.</div>;

  return (
    <React.StrictMode>
      <BrowserRouter basename={getRouterBasename()}>
        <Layout>
          <Page />
        </Layout>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default ReactPageFrame;
