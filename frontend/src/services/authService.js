import { apiClient, clearAuthTokens, setAuthTokens } from "@/lib/apiClient";

const normalizeUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    ...user,
    name: user.name || user.full_name || "",
  };
};

const extractAuthPayload = (payload) => {
  const user = normalizeUser(payload?.user || payload);
  const tokens = payload?.tokens || {};

  return {
    user,
    tokens: {
      access: tokens.access || payload?.access,
      refresh: tokens.refresh || payload?.refresh,
    },
  };
};

export const authService = {
  async login({ email, password }) {
    const payload = await apiClient.post(
      "/auth/login/",
      { email, password },
      { requiresAuth: false },
    );

    const { user, tokens } = extractAuthPayload(payload);
    setAuthTokens(tokens);
    return user;
  },

  async register({ fullName, email, password, role }) {
    const payload = await apiClient.post(
      "/auth/register/",
      {
        full_name: fullName,
        email,
        password,
        role,
      },
      { requiresAuth: false },
    );

    const { user, tokens } = extractAuthPayload(payload);
    setAuthTokens(tokens);
    return user;
  },

  async me() {
    const payload = await apiClient.get("/auth/me/");
    return normalizeUser(payload);
  },

  logout() {
    clearAuthTokens();
  },
};
