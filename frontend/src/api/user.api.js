import api from "./axios";

export const getProfile = () => {
  api.get("/api/users/me");
};

export const updateProfile = (data) => {
  api.patch("/api/users/me", data);
};

export const toggleAvailability = (isAvailable) => {
  api.patch("/api/users/availability", { isAvailable });
};

export const updateDonation = (data) => {
  api.patch("/api/users/donation", data);
};
