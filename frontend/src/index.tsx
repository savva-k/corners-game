import React from "react";
import App from "./App";
import "./index.css";
import { GameContextProvider } from "./context/GameContextProvider";
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <GameContextProvider>
      <Router>
        <App />
      </Router>
    </GameContextProvider>
  </React.StrictMode>
);
