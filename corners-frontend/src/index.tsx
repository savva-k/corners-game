import React from "react";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
