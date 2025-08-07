export const BASE_URL = "http://localhost:7001";
export const API_VERSION = "/api/v1";

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_VERSION}/auth/signup`,
    LOGIN: `${API_VERSION}/auth/login`,
    GET_PROFILE: `${API_VERSION}/auth/profile`,
  },
  TRANSACTION: {
    GET_ALL: `${API_VERSION}/transactions/get-all`,
    // GET_BY_ID: `${API_VERSION}/transactions/:id`,
    CREATE: `${API_VERSION}/transactions`,
    UPDATE: `${API_VERSION}/transactions/:id`,
    DELETE: `${API_VERSION}/transactions/:id`,
  },
};
