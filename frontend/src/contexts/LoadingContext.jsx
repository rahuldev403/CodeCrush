import { createContext, useContext, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  const showLoading = (message = "Loading...") => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className="h-16 w-16 animate-spin border-4 border-primary border-t-transparent shadow-lg"
                style={{ imageRendering: "pixelated" }}
              />
              <div className="absolute inset-0 animate-ping opacity-20">
                <div
                  className="h-16 w-16 border-4 border-primary border-t-transparent"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </div>
            <p className="font-mono text-sm font-bold text-primary animate-pulse">
              {loadingMessage}
            </p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};
