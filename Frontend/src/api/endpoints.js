import api from "./axios";

export const authApi = {
    signup: (data) => api.post("/auth/signup", data),
    login: (data) => api.post("/auth/login", data),
    getProfile: () => api.get("/users/profile"),
};

export const userApi = {
    profile: () => api.get("/users/profile"),
    adminUsers: () => api.get("/users/admin"),
};

export const employeeApi = {
    list: (params) => api.get("/employees", { params }),

    stats: () => api.get("/employees/stats"),

    getById: (id) => api.get(`/employees/${id}`),

    create: (data) => api.post("/employees", data),

    update: (id, data) => api.patch(`/employees/${id}`, data),

    remove: (id) => api.delete(`/employees/${id}`),
};