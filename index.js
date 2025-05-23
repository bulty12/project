import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";  // Make sure the path is correct
import "./index.css";
import "leaflet/dist/leaflet.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);