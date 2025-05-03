interface AppConfig {
  port: number;
  apiUrl: string;
  jwtSecret: string;
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || "4001"),
  apiUrl: process.env.API_URL || "http://localhost:4000",
  jwtSecret: process.env.JWT_SECRET || "microservicio-secret",
};

export default config;