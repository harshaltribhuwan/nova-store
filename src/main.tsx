import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set page title
document.title = "TravelMate - Your Personal Travel Assistant";

createRoot(document.getElementById("root")!).render(<App />);
