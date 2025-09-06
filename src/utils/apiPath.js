export const BASE_URL = "http://localhost:7001";
export const API_VERSION = "/api/v1";

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_VERSION}/auth/signup`,
    LOGIN: `${API_VERSION}/auth/login`,
    GET_PROFILE: `${API_VERSION}/auth/profile`,
  },
  TRANSACTION: {
    GET_ALL: `${API_VERSION}/transaction/get-all`,
    GET_BY_ID: `${API_VERSION}/transaction/:id`,
    CREATE: `${API_VERSION}/transaction/add`,
    UPDATE: `${API_VERSION}/transaction/edit/:id`,
    DELETE: `${API_VERSION}/transaction/delete/:id`,
  },
  CATEGORY: {
    GET_ALL: `${API_VERSION}/category/get-all`,
    GET_BY_ID: `${API_VERSION}/category/:id`,
    CREATE: `${API_VERSION}/category/add`,
    UPDATE: `${API_VERSION}/category/edit/:id`,
    DELETE: `${API_VERSION}/category/delete/:id`,
  },
};
