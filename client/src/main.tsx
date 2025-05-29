import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App.tsx";
import { Provider } from "./Provider.tsx";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
