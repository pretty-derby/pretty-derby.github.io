import React from "react";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { getRouterBasename } from "@/lib/locale";
import "./styles/index.css";
import "./styles/old.css";
import "./i18n";

const ClientApp = () => (
  <React.StrictMode>
    <BrowserRouter basename={getRouterBasename()}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

export default ClientApp;
