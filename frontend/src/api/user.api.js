import api from "./axios";

// Profile
export const getProfile = () => api.get("/api/users/me");

export const updateProfile = (data) => api.patch("/api/users/me", data);

// Availability
export const toggleAvailability = (isAvailable) =>
  api.patch("/api/users/availability", { isAvailable });

// Donation
export const updateDonation = (data) => api.patch("/api/users/donation", data);
