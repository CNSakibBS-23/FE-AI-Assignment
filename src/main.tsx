import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "@/app/App";
import "@/styles/global.css";

async function enableMocking() {
  if (!import.meta.env.DEV) return;

  const { worker } = await import("@/infrastructure/msw/browser");
  await worker.start({
    onUnhandledRequest: "bypass",
  });
}

await enableMocking();

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
