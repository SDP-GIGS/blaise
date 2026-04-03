const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const getAuthTokens = () => ({
  access: localStorage.getItem(ACCESS_TOKEN_KEY),
  refresh: localStorage.getItem(REFRESH_TOKEN_KEY),
});

export const setAuthTokens = ({ access, refresh }) => {
  if (access) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
  }

  if (refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
};

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const buildUrl = (endpoint) => {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }

  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${normalizedEndpoint}`;
};

const parseResponseBody = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { detail: text } : null;
};

let pendingRefreshPromise = null;

const refreshAccessToken = async () => {
  const { refresh } = getAuthTokens();

  if (!refresh) {
    throw new ApiError("No refresh token available.", 401, null);
  }

  const response = await fetch(buildUrl("/auth/refresh/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  const data = await parseResponseBody(response);

  if (!response.ok || !data?.access) {
    throw new ApiError("Session expired. Please sign in again.", response.status, data);
  }

  setAuthTokens({ access: data.access, refresh: data.refresh });
  return data.access;
};

const getValidAccessToken = async () => {
  const { access } = getAuthTokens();

  if (access) {
    return access;
  }

  if (!pendingRefreshPromise) {
    pendingRefreshPromise = refreshAccessToken().finally(() => {
      pendingRefreshPromise = null;
    });
  }

  return pendingRefreshPromise;
};

export const request = async (endpoint, options = {}) => {
  const {
    method = "GET",
    body,
    headers = {},
    requiresAuth = true,
    retryOnAuthError = true,
  } = options;

  const requestHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (requiresAuth) {
    const accessToken = await getValidAccessToken();

    if (accessToken) {
      requestHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }

  const response = await fetch(buildUrl(endpoint), {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    const canRetry = requiresAuth && retryOnAuthError && response.status === 401;

    if (canRetry) {
      try {
        if (!pendingRefreshPromise) {
          pendingRefreshPromise = refreshAccessToken().finally(() => {
            pendingRefreshPromise = null;
          });
        }

        const nextAccessToken = await pendingRefreshPromise;

        return request(endpoint, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${nextAccessToken}`,
          },
          retryOnAuthError: false,
        });
      } catch (refreshError) {
        clearAuthTokens();
        throw refreshError;
      }
    }

    const message = data?.detail || data?.error || "Request failed.";
    throw new ApiError(message, response.status, data);
  }

  return data;
};

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: "PUT", body }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: "PATCH", body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: "DELETE" }),
};
