import { apiClient } from "./client";

const unwrapResponse = (payload) => payload?.data ?? payload;

export const fetchMe = async () => {
  const { data } = await apiClient.get("/user/me");
  return unwrapResponse(data);
};

export const updateProfile = async (payload) => {
  const { data } = await apiClient.patch("/user/me", payload);
  return unwrapResponse(data);
};

export const getAvatarSignature = async (style = "face") => {
  const { data } = await apiClient.get("/user/avatar/signature", {
    params: { style },
  });
  return unwrapResponse(data);
};

export const updatePassword = async (payload) => {
  const { data } = await apiClient.patch("/user/me/password", payload);
  return unwrapResponse(data);
};

export const fetchFeed = async (params) => {
  const { data } = await apiClient.get("/user/feed", { params });
  return unwrapResponse(data);
};

export const swipeUser = async (payload) => {
  const { data } = await apiClient.post("/user/swipe", payload);
  return unwrapResponse(data);
};

export const fetchMatches = async () => {
  const { data } = await apiClient.get("/user/matches");
  return unwrapResponse(data);
};

export const fetchRequests = async (params) => {
  const { data } = await apiClient.get("/user/requests", { params });
  return unwrapResponse(data);
};

export const fetchSentRequests = async () => {
  const { data } = await apiClient.get("/user/sentrequests");
  return unwrapResponse(data);
};

export const respondToRequest = async (requestId, action) => {
  const { data } = await apiClient.patch("/user/response", {
    requestId,
    action,
  });
  return unwrapResponse(data);
};
