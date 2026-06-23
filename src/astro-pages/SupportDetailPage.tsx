import React, { useEffect, useState } from "react";

type FrameComponent = React.ComponentType<{ Page: React.ComponentType }>;
type SupportDetailComponent = React.ComponentType<{ id?: string; page?: boolean }>;

const SupportDetailPage = ({ id }: { id: string }) => {
  const [Loaded, setLoaded] = useState<{
    Frame: FrameComponent;
    SupportDetail: SupportDetailComponent;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([import("./ReactPageFrame"), import("@/components/support/SupportDetail")]).then(
      ([frameModule, detailModule]) => {
        if (mounted) {
          setLoaded({
            Frame: frameModule.default,
            SupportDetail: detailModule.default,
          });
        }
      }
    );

    return () => {
      mounted = false;
    };
  }, []);

  if (!Loaded) return null;

  const Page = () => (
    <div className="flex flex-auto w-full flex-wrap max-w-6xl mx-auto">
      <Loaded.SupportDetail id={id} page />
    </div>
  );

  return <Loaded.Frame Page={Page} />;
};

export default SupportDetailPage;
