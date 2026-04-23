import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import { useState } from "react";
import SplashScreen from "./components/SplashScreen";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";

function Root() {
  const [showSplash, setShowSplash] = useState(true);
  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      {!showSplash && (
        <ThemeProvider>
          <AuthProvider>
            <App />
            <ThemeToggle />
          </AuthProvider>
        </ThemeProvider>
      )}
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);


