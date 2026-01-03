import api from "./axios";

export const searchDonors = (params) => {
  api.get("/api/users/donors", { params });
};
