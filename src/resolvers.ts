import apiClient from "./apiClient";

interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: number;
    email: string;
    nombre?: string;
    biografia?: string;
    role: number;
    two_factor_enabled: boolean;
  };
  requires2FA?: boolean;
  tempToken?: string;
  message?: string;
}

interface Context {
  authHeader?: string;
}

const resolvers = {
  Query: {
    users: async (_: any, __: any, context: Context) => {
      try {
        if (!context.authHeader) {
          throw new Error("Acceso no autorizado: Token requerido");
        }

        const users = await apiClient.getUsers(
          context.authHeader.replace("Bearer ", ""),
        );
        return users.map((user: any) => ({
          id: user.id_usuario,
          email: user.email,
          nombre: user.nombre,
          biografia: user.biografia,
          role: user.id_rol,
          two_factor_enabled: user.two_factor_enabled,
          last_login: user.last_login,
        }));
      } catch (error) {
        console.error("Error en resolver users:", error);
        throw new Error(
          error instanceof Error ? error.message : "Error desconocido",
        );
      }
    },
  },

  Mutation: {
    login: async (
      _: any,
      { email, password }: { email: string; password: string },
    ): Promise<AuthResponse> => {
      try {
        const response = await apiClient.login(email, password);

        if (response.requires2FA) {
          return {
            requires2FA: true,
            tempToken: response.tempToken,
            message: response.message,
          };
        }

        return {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user
            ? {
                id: response.user.id,
                email: response.user.email,
                nombre: response.user.nombre,
                biografia: response.user.biografia,
                role: response.user.role,
                two_factor_enabled: response.user.two_factor_enabled,
              }
            : undefined,
        };
      } catch (error) {
        console.error("Error en resolver login:", error);
        throw new Error(
          error instanceof Error ? error.message : "Error en el login",
        );
      }
    },

    verify2FA: async (
      _: any,
      { token, tempToken }: { token: string; tempToken: string },
    ): Promise<AuthResponse> => {
      try {
        const response = await apiClient.verify2FA(token, tempToken);

        return {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user
            ? {
                id: response.user.id,
                email: response.user.email,
                nombre: response.user.nombre,
                biografia: response.user.biografia,
                role: response.user.role,
                two_factor_enabled: response.user.two_factor_enabled,
              }
            : undefined,
        };
      } catch (error) {
        console.error("Error en resolver verify2FA:", error);
        throw new Error(
          error instanceof Error ? error.message : "Error en verificación 2FA",
        );
      }
    },
  },

  UserRole: {
    ADMIN: 1,
    CURADOR: 2,
    INVESTIGADOR: 3,
    VISITANTE: 4,
  },
};

export default resolvers;