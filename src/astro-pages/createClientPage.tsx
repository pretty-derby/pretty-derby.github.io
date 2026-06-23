import React, { useEffect, useState } from "react";

type PageModule = {
  default: React.ComponentType;
};

type FrameModule = {
  default: React.ComponentType<{ Page: React.ComponentType }>;
};

export function createClientPage(loadPage: () => Promise<PageModule>) {
  return function ClientPage() {
    const [Loaded, setLoaded] = useState<{
      Frame: FrameModule["default"];
      Page: PageModule["default"];
    } | null>(null);

    useEffect(() => {
      let mounted = true;

      Promise.all([import("./ReactPageFrame"), loadPage()]).then(([frameModule, pageModule]) => {
        if (mounted) {
          setLoaded({
            Frame: frameModule.default,
            Page: pageModule.default,
          });
        }
      });

      return () => {
        mounted = false;
      };
    }, []);

    if (!Loaded) return null;

    return <Loaded.Frame Page={Loaded.Page} />;
  };
}
