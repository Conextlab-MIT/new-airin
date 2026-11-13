import { Toaster } from "@airin/ui/toaster";
import { TooltipProvider } from "@airin/ui/tooltip";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ServiceWorkerUpdatePrompt } from "@/components/ServiceWorkerUpdatePrompt";
import { LocaleProvider } from "@/context/locale-context";
import { OwnerSimpleUiProvider } from "@/context/owner-simple-ui-context";
import { ThemeProvider } from "@/context/theme-context";
import { UiModeProvider } from "@/context/ui-mode-context";
import { App } from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LocaleProvider>
          <UiModeProvider>
            <OwnerSimpleUiProvider>
              <TooltipProvider>
                <App />
                <Toaster />
                <ServiceWorkerUpdatePrompt />
              </TooltipProvider>
            </OwnerSimpleUiProvider>
          </UiModeProvider>
        </LocaleProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
