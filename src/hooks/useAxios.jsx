import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/apiPath";

const useAxios = (endpoint, data, options = {}) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef();
  
  const axiosInstance = useRef(
    axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
  );

  //! Add token interceptor
  useEffect(() => {
    const requestInterceptor = axiosInstance.current.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance.current.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  const {
    method = "POST",
    headers = {},
    maxRetries = 3,
    retryDelay = 1000,
    enabled = true,
    manual = false,
  } = options;

  const fetchData = useCallback(
    async (overrideData) => {
      if (!enabled) {
        console.log("Fetch disabled due to enabled=false");
        return;
      }

      abortControllerRef.current = new AbortController();
      setLoading(true);
      setError(null);

      try {
        const requestData = overrideData || data;
        const config = {
          method: method.toUpperCase(),
          url: endpoint,
          data: ["POST", "PUT", "PATCH"].includes(method.toUpperCase())
            ? requestData
            : undefined,
          params: method.toUpperCase() === "GET" ? requestData : undefined,
          headers: {
            ...headers,
          },
          signal: abortControllerRef.current.signal,
        };

        const result = await axiosInstance.current(config);
        setResponse(result.data);
        setError(null);
        setRetryCount(0);
        return result.data;
      } catch (err) {
        if (err.name === "AbortError" || err.code === "ERR_CANCELED") {
          console.log("Request aborted");
          return;
        }

        console.error("Fetch error:", err.response?.data || err.message || err);
        if (retryCount < maxRetries) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            fetchData(overrideData);
          }, retryDelay * Math.pow(2, retryCount));
        } else {
          setError(err);
          throw err;
        }
      } finally {
        setLoading(false);
      }
    },
    [
      endpoint,
      method,
      headers,
      retryCount,
      maxRetries,
      retryDelay,
      enabled,
      data,
    ]
  );

  useEffect(() => {
    if (!manual) {
      fetchData();
    }
  }, [fetchData, manual]);

  const retry = useCallback(() => {
    setRetryCount(0);
    fetchData();
  }, [fetchData]);

  const execute = useCallback(
    async (executeData) => {
      console.log("Executing with data:", executeData);
      return await fetchData(executeData);
    },
    [fetchData]
  );

  return { response, error, loading, retry, execute };
};

export default useAxios;
