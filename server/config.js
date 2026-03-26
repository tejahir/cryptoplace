const isProduction = process.env.NODE_ENV === 'production';

const getAllowedOrigins = () => {
  const configuredOrigins = process.env.CLIENT_ORIGIN
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return configuredOrigins?.length ? configuredOrigins : ['http://localhost:5173'];
};

export const config = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret:
    process.env.JWT_SECRET || (isProduction ? '' : 'cryptoplace-dev-jwt-secret-change-me'),
  jwtExpiresIn: '7d',
  allowedOrigins: getAllowedOrigins(),
  isProduction,
};

if (!config.jwtSecret) {
  throw new Error('JWT_SECRET is required in production.');
}
