import AppRouter from "@/routes/AppRouter";
import { Toaster } from "sonner";
import { LoadingProvider } from "@/contexts/LoadingContext";

function App() {
  return (
    <LoadingProvider>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast: "border-4 border-primary shadow-xl font-mono",
            title: "font-bold text-sm",
            description: "text-xs",
            success: "bg-primary/10 text-primary border-primary",
            error: "bg-destructive/10 text-destructive border-destructive",
            info: "bg-secondary/10 text-secondary-foreground border-secondary",
          },
        }}
      />
    </LoadingProvider>
  );
}

export default App;
