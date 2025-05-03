import axios, { AxiosError } from "axios";
import { config } from "./config";

interface ApiError {
  message: string;
  [key: string]: any;
}

interface ApiResponse {
  data?: any;
  message?: string;
}

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 5000,
});

function isApiError(error: any): error is { response: { data: ApiError } } {
  return error?.response?.data?.message !== undefined;
}

const apiClient = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      if (isApiError(error)) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Error en el login");
    }
  },

  verify2FA: async (token: string, tempToken: string) => {
    try {
      const response = await api.post(
        "/auth/verify-2fa",
        { token },
        {
          headers: { Authorization: `Bearer ${tempToken}` },
        },
      );
      return response.data;
    } catch (error) {
      if (isApiError(error)) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Error en la verificación 2FA");
    }
  },

  getUsers: async (accessToken: string) => {
    try {
      const response = await api.get("/auth/users", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      if (isApiError(error)) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Error obteniendo usuarios");
    }
  },
};

export default apiClient;