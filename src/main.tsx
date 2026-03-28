import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeDB } from "./lib/db";

initializeDB();

createRoot(document.getElementById("root")!).render(<App />);
