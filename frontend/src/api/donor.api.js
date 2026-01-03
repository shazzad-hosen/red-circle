import api from "./axios";

export const searchDonors = (params) => api.get("/users/donors", { params });
