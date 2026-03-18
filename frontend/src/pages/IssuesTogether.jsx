import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import AppShell from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  fetchAvailableIssues,
  fetchGitHubStatus,
  syncGitHubRepos,
} from "@/api/github";
import { fetchMatches } from "@/api/user";
import { createSocket } from "@/lib/socket";

const overlapScore = (issue, match) => {
  const issueText =
    `${issue.title} ${(issue.labels || []).join(" ")}`.toLowerCase();
  const skills = (match?.user?.skills || []).map((s) => s.toLowerCase());
  const shared = skills.filter((skill) => issueText.includes(skill));
  return Math.min(
    100,
    40 + shared.length * 20 + Math.max(match?.compatibilityScore || 0, 0) * 0.3,
  );
};

const weekendHint = (availability) => {
  if (availability === "HACKATHON" || availability === "PART_TIME") {
    return "this weekend";
  }
  return "this week";
};

const IssuesTogether = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState("");
  const [githubConnected, setGithubConnected] = useState(false);
  const [issues, setIssues] = useState([]);
  const [matches, setMatches] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    const socket = createSocket();

    const loadData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const status = await fetchGitHubStatus();
        if (!isMounted) return;

        setGithubConnected(Boolean(status?.connected));

        if (!status?.connected) {
          setIssues([]);
          setMatches([]);
          return;
        }

        const [issuesData, matchesData] = await Promise.all([
          fetchAvailableIssues({ limit: 60 }),
          fetchMatches(),
        ]);

        if (!isMounted) return;
        setIssues(issuesData?.issues || []);
        setMatches(matchesData?.matches || []);
      } catch (err) {
        if (!isMounted) return;
        setError(
          err.response?.data?.message || "Failed to load issue matching data.",
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    // Listen for real-time compatibility score updates
    socket.on("compatibility-ready", (data) => {
      if (!isMounted) return;
      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match.matchId === data.matchId
            ? {
                ...match,
                compatibilityScore: data.compatibilityScore,
                compatibilitySummary: data.compatibilitySummary,
              }
            : match,
        ),
      );
    });

    // Listen for compatibility errors
    socket.on("compatibility-error", (data) => {
      if (!isMounted) return;
      console.error("Compatibility generation failed for match:", data.matchId);
    });

    // Listen for connection removal from other user
    socket.on("connection-removed", (data) => {
      if (!isMounted) return;
      setMatches((prev) => prev.filter((m) => m.matchId !== data.matchId));
    });

    return () => {
      isMounted = false;
      socket.off("compatibility-ready");
      socket.off("compatibility-error");
      socket.off("connection-removed");
      socket.disconnect();
    };
  }, []);

  const recommendations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filteredIssues = !normalizedQuery
      ? issues
      : issues.filter((issue) => {
          const haystack =
            `${issue.owner}/${issue.repo} ${issue.title} ${(issue.labels || []).join(" ")}`.toLowerCase();
          return haystack.includes(normalizedQuery);
        });

    return filteredIssues
      .map((issue) => {
        if (!matches.length) {
          return { issue, partner: null, score: 0 };
        }

        const rankedPartners = matches
          .map((match) => ({
            match,
            score: overlapScore(issue, match),
          }))
          .sort((a, b) => b.score - a.score);

        return {
          issue,
          partner: rankedPartners[0]?.match || null,
          score: rankedPartners[0]?.score || 0,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [issues, matches, query]);

  const handleSync = async () => {
    setIsSyncing(true);
    setError("");

    try {
      await syncGitHubRepos();
      const issuesData = await fetchAvailableIssues({ limit: 60 });
      setIssues(issuesData?.issues || []);
      toast.success("GitHub issues synced");
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to sync GitHub issues";
      setError(message);
      toast.error("Sync failed", { description: message });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AppShell
      title="Find Issues Together"
      subtitle="Pair your matches with beginner and intermediate GitHub issues."
      actions={
        <Button
          type="button"
          variant="secondary"
          onClick={handleSync}
          disabled={isSyncing || !githubConnected}
          className="border-4 border-border font-mono text-xs font-bold shadow-md"
        >
          {isSyncing ? "Syncing..." : "Sync Issues"}
        </Button>
      }
    >
      {error ? (
        <div className="mb-4 border-4 border-destructive bg-destructive/10 p-4 font-mono text-sm text-destructive shadow-lg">
          ⚠ {error}
        </div>
      ) : null}

      {!githubConnected && !isLoading ? (
        <Card className="border-4 border-primary shadow-xl">
          <CardContent className="space-y-4 p-6 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              Connect your GitHub account first to unlock issue-based matching.
            </p>
            <Link to="/profile" className="inline-block">
              <Button className="border-4 border-border font-mono font-bold shadow-lg">
                Go to Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : null}

      {githubConnected ? (
        <div className="space-y-4">
          <Input
            placeholder="Search by repo, title, or label"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="border-4 border-border font-mono shadow-md"
          />

          {isLoading ? (
            <Card className="border-4 border-muted shadow-xl">
              <CardContent className="py-10 text-center font-mono text-sm text-muted-foreground animate-pulse">
                Loading issue recommendations...
              </CardContent>
            </Card>
          ) : recommendations.length === 0 ? (
            <Card className="border-4 border-muted shadow-xl">
              <CardContent className="py-10 text-center font-mono text-sm text-muted-foreground">
                No curated issues found yet. Try syncing or broadening your
                query.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {recommendations.map(({ issue, partner, score }) => (
                <Card
                  key={issue.id}
                  className="border-4 border-primary shadow-xl"
                >
                  <CardContent className="space-y-3 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="border-2 border-border bg-primary/10 font-mono text-xs font-bold text-primary">
                        {issue.owner}/{issue.repo}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="border-2 border-border font-mono text-xs font-bold"
                      >
                        #{issue.number}
                      </Badge>
                      {score > 0 ? (
                        <Badge
                          variant="outline"
                          className="border-2 border-border font-mono text-xs"
                        >
                          Fit {Math.round(score)}%
                        </Badge>
                      ) : null}
                    </div>

                    <a
                      href={issue.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block font-mono text-sm font-bold text-foreground hover:text-primary"
                    >
                      {issue.title}
                    </a>

                    <div className="flex flex-wrap gap-2">
                      {(issue.labels || []).slice(0, 4).map((label) => (
                        <Badge
                          key={`${issue.id}-${label}`}
                          variant="outline"
                          className="border-2 font-mono text-[10px]"
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>

                    {partner ? (
                      <div className="rounded border-2 border-accent bg-accent/10 p-3 font-mono text-xs text-foreground">
                        You and {partner.user?.name || "your match"} can solve{" "}
                        {issue.owner}/{issue.repo}#{issue.number}{" "}
                        {weekendHint(partner.user?.availability)}.
                      </div>
                    ) : (
                      <div className="rounded border-2 border-muted p-3 font-mono text-xs text-muted-foreground">
                        No partner recommendation yet. Get more matches to
                        unlock pairing.
                      </div>
                    )}

                    <div className="flex gap-2">
                      <a
                        href={issue.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1"
                      >
                        <Button
                          type="button"
                          variant="secondary"
                          className="w-full border-4 border-border font-mono text-xs font-bold shadow-md"
                        >
                          View Issue
                        </Button>
                      </a>

                      {partner ? (
                        <Link
                          to={`/chat/${partner.matchId}`}
                          className="flex-1"
                        >
                          <Button className="w-full border-4 border-border font-mono text-xs font-bold shadow-md">
                            Start Sprint
                          </Button>
                        </Link>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </AppShell>
  );
};

export default IssuesTogether;
