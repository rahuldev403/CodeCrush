import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { connectGitHubWithCode } from "@/api/github";

const GitHubCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Connecting your GitHub account...");

  const code = useMemo(() => searchParams.get("code") || "", [searchParams]);
  const state = useMemo(() => searchParams.get("state") || "", [searchParams]);
  const oauthError = useMemo(
    () =>
      searchParams.get("error_description") || searchParams.get("error") || "",
    [searchParams],
  );

  useEffect(() => {
    const run = async () => {
      if (oauthError) {
        toast.error("GitHub authorization failed", {
          description: oauthError,
        });
        navigate("/profile", { replace: true });
        return;
      }

      if (!code) {
        toast.error("GitHub callback is missing code");
        navigate("/profile", { replace: true });
        return;
      }

      try {
        await connectGitHubWithCode({ code, state });
        toast.success("GitHub connected successfully");
        navigate("/profile", { replace: true });
      } catch (error) {
        const message =
          error?.response?.data?.message || "Failed to connect GitHub account";

        if (
          error?.response?.status === 401 ||
          /refresh token|unauthorized|expired/i.test(message)
        ) {
          toast.error("Session expired", {
            description:
              "Please sign in again, then connect GitHub from profile.",
          });
          navigate("/login", { replace: true });
          return;
        }

        setStatus(message);
        toast.error("GitHub connection failed", { description: message });
        setTimeout(() => navigate("/profile", { replace: true }), 1200);
      }
    };

    run();
  }, [code, state, oauthError, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md border-4 border-primary bg-card p-6 text-center shadow-xl">
        <h1 className="font-mono text-lg font-bold text-foreground">
          GitHub Connection
        </h1>
        <p className="mt-3 font-mono text-sm text-muted-foreground">{status}</p>
      </div>
    </div>
  );
};

export default GitHubCallback;
