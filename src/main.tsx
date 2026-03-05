import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { adminStore } from "@/store/adminStore";
import { bootstrapApiFetch } from "@/lib/bootstrapApiFetch";
import "./app/globals.css"; // Original global css file for now

bootstrapApiFetch();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={adminStore}>
      <App />
    </Provider>
  </React.StrictMode>
);
