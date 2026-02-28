export const ENV = {
  PORT: Number(process.env.PORT ?? 3000),
  JWT_SECRET: process.env.JWT_SECRET ?? 'replace-this-with-strong-secret',
  TOKEN_EXPIRES_SECONDS: Number(process.env.TOKEN_EXPIRES_SECONDS ?? 86400),
};
