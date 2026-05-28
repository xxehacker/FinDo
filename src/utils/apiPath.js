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
    GET_BY_ID: (id) => `${API_VERSION}/transaction/${id}`,
    CREATE: `${API_VERSION}/transaction/add`,
    UPDATE: (id) => `${API_VERSION}/transaction/edit/${id}`,
    DELETE: (id) => `${API_VERSION}/transaction/delete/${id}`,
    DAY_WISE_SUMMARY: `${API_VERSION}/transaction/day-wise-summary`,
    SALARY_SCHEDULE_PREVIEW: `${API_VERSION}/transaction/salary-schedule-preview`,
    IMPORT_SALARY_HISTORY: `${API_VERSION}/transaction/import-salary-history`,
  },
  CATEGORY: {
    GET_ALL: `${API_VERSION}/category/get-all`,
    GET_BY_ID: (id) => `${API_VERSION}/category/${id}`,
    CREATE: `${API_VERSION}/category/add`,
    UPDATE: (id) => `${API_VERSION}/category/edit/${id}`,
    DELETE: (id) => `${API_VERSION}/category/delete/${id}`,
  },
  BANK: {
    GET_ALL: `${API_VERSION}/bank/get-all`,
    GET_BY_ID: (id) => `${API_VERSION}/bank/${id}`,
    CREATE: `${API_VERSION}/bank/add`,
    UPDATE: (id) => `${API_VERSION}/bank/edit/${id}`,
    DELETE: (id) => `${API_VERSION}/bank/delete/${id}`,
  },
  PRODUCT: {
    GET_ALL: `${API_VERSION}/product/get-all`,
    GET_BY_ID: (id) => `${API_VERSION}/product/${id}`,
    CREATE: `${API_VERSION}/product/add`,
    UPDATE: (id) => `${API_VERSION}/product/edit/${id}`,
    DELETE: (id) => `${API_VERSION}/product/delete/${id}`,
  },
  UPLOAD: `${API_VERSION}/upload`,
  DASHBOARD: {
    GET_DATA: `${API_VERSION}/dashboard`,
    GET_STATS: `${API_VERSION}/dashboard/stats`,
  },
  TASK: {
    GET_ALL: `${API_VERSION}/task/get-all`,
    GET_BY_ID: (id) => `${API_VERSION}/task/${id}`,
    CREATE: `${API_VERSION}/task/add`,
    UPDATE: (id) => `${API_VERSION}/task/edit/${id}`,
    DELETE: (id) => `${API_VERSION}/task/delete/${id}`,
  },
};
