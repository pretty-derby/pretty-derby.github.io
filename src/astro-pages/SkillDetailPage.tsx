import React, { useEffect, useState } from "react";

type FrameComponent = React.ComponentType<{ Page: React.ComponentType }>;
type SkillDetailComponent = React.ComponentType<{ id?: string; isNur?: boolean; page?: boolean }>;

const SkillDetailPage = ({ id }: { id: string }) => {
  const [Loaded, setLoaded] = useState<{
    Frame: FrameComponent;
    SkillDetail: SkillDetailComponent;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([import("./ReactPageFrame"), import("@/components/skill/SkillDetail")]).then(
      ([frameModule, detailModule]) => {
        if (mounted) {
          setLoaded({
            Frame: frameModule.default,
            SkillDetail: detailModule.default,
          });
        }
      }
    );

    return () => {
      mounted = false;
    };
  }, []);

  if (!Loaded) return null;

  const Page = () => <Loaded.SkillDetail id={id} isNur={false} page />;

  return <Loaded.Frame Page={Page} />;
};

export default SkillDetailPage;
