export const ENV = {
  PORT: Number(process.env.PORT ?? 3000),
  JWT_SECRET: process.env.JWT_SECRET ?? 'replace-this-with-strong-secret',
  TOKEN_EXPIRES_SECONDS: Number(process.env.TOKEN_EXPIRES_SECONDS ?? 86400),
  DEV_SEED_ENABLED: (process.env.DEV_SEED_ENABLED ?? 'true') === 'true',
  DEV_SUPER_ADMIN_NAME: process.env.DEV_SUPER_ADMIN_NAME ?? 'Dev Super Admin',
  DEV_SUPER_ADMIN_EMAIL: process.env.DEV_SUPER_ADMIN_EMAIL ?? 'superadmin@local.test',
  DEV_SUPER_ADMIN_PASSWORD: process.env.DEV_SUPER_ADMIN_PASSWORD ?? 'superadmin123',
};