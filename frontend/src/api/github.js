import { apiClient } from "./client";

const unwrapResponse = (payload) => payload?.data ?? payload;

export const getGitHubConnectUrl = async () => {
  const { data } = await apiClient.get("/github/connect-url");
  return unwrapResponse(data);
};

export const connectGitHubWithCode = async (payload) => {
  const { data } = await apiClient.post("/github/callback", payload);
  return unwrapResponse(data);
};

export const disconnectGitHub = async () => {
  const { data } = await apiClient.post("/github/disconnect");
  return unwrapResponse(data);
};

export const syncGitHubRepos = async () => {
  const { data } = await apiClient.post("/github/sync");
  return unwrapResponse(data);
};

export const fetchGitHubStatus = async () => {
  const { data } = await apiClient.get("/github/me");
  return unwrapResponse(data);
};

export const fetchAvailableIssues = async (params) => {
  const { data } = await apiClient.get("/github/issues", { params });
  return unwrapResponse(data);
};
