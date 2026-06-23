import React, { useEffect, useState } from "react";

type ClientAppComponent = React.ComponentType;

const ReactApp = () => {
  const [ClientApp, setClientApp] = useState<ClientAppComponent | null>(null);

  useEffect(() => {
    let mounted = true;

    import("./ClientApp").then(({ default: LoadedApp }) => {
      if (mounted) {
        setClientApp(() => LoadedApp);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return ClientApp ? <ClientApp /> : null;
};

export default ReactApp;
