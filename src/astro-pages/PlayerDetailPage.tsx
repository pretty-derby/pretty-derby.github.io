import React, { useEffect, useState } from "react";

type FrameComponent = React.ComponentType<{ Page: React.ComponentType }>;
type PlayerDetailComponent = React.ComponentType<{ id?: string; isNur?: boolean; page?: boolean }>;

const PlayerDetailPage = ({ id }: { id: string }) => {
  const [Loaded, setLoaded] = useState<{
    Frame: FrameComponent;
    PlayerDetail: PlayerDetailComponent;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([import("./ReactPageFrame"), import("@/components/player/PlayerDetail")]).then(
      ([frameModule, detailModule]) => {
        if (mounted) {
          setLoaded({
            Frame: frameModule.default,
            PlayerDetail: detailModule.default,
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
      <Loaded.PlayerDetail id={id} isNur={false} page />
    </div>
  );

  return <Loaded.Frame Page={Page} />;
};

export default PlayerDetailPage;
