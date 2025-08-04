export const BASE_URL = "http://localhost:9000";

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: "/api/v1/users/signup",
    LOGIN: "/api/v1/users/login",
    GET_PROFILE: "/api/v1/users/profile",
  },
  USERS: {
    GET_ALL_USERS: "/api/v1/user/",
    GET_USER_BY_ID: (userId) => `/api/v1/user/${userId}`,
    CREATE_USER: "/api/v1/user/create",
    UPDATE_USER_BY_ID: (userId) => `/api/v1/user/${userId}`,
    DELETE_USER: (userId) => `/api/v1/user/${userId}`,
  },
};