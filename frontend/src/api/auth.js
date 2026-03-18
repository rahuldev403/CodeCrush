import { apiClient } from "./client";

const unwrapResponse = (payload) => payload?.data ?? payload;

export const login = async (payload) => {
  const { data } = await apiClient.post("/auth/login", payload);
  return unwrapResponse(data);
};

export const register = async (payload) => {
  const { data } = await apiClient.post("/auth/register", payload);
  return unwrapResponse(data);
};

export const verifyRegistration = async (payload) => {
  const { data } = await apiClient.post("/auth/verify-registration", payload);
  return unwrapResponse(data);
};

export const resendOtp = async (payload) => {
  const { data } = await apiClient.post("/auth/resend-otp", payload);
  return unwrapResponse(data);
};

export const logout = async () => {
  const { data } = await apiClient.post("/auth/logout");
  return unwrapResponse(data);
};

export const refresh = async () => {
  const { data } = await apiClient.post("/auth/refresh");
  return unwrapResponse(data);
};
