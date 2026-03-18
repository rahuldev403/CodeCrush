import { apiClient } from "./client";

const unwrapResponse = (payload) => payload?.data ?? payload;

export const fetchMessages = async (matchId) => {
  const { data } = await apiClient.get(`/messages/${matchId}`);
  return unwrapResponse(data);
};

export const deleteMessage = async (messageId) => {
  const { data } = await apiClient.delete(`/messages/${messageId}`);
  return unwrapResponse(data);
};
