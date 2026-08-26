const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const redis = require("../config/redisConfig");

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRY = "15m";
export const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60;

const generateToken = (payload) => {
  const now = Math.floor(Date.now() / 1000);
  const accessExp = now + 15 * 60;
  const refreshExp = now + REFRESH_TOKEN_EXPIRY;

  const accessToken = jwt.sign(
    {
      ...payload,
      exp: accessExp,
    },
    ACCESS_TOKEN_SECRET,
    { algorithm: "HS256" },
  );

  const jti = randomBytes(16).toString("hex");

  const refreshToken = jwt.sign(
    {
      ...payload,
      jti,
      exp: refreshExp,
    },
    REFRESH_TOKEN_SECRET,
    { algorithm: "HS256" },
  );

  return {
    accessToken,
    refreshToken,
    accessTokenExpiry: accessExp,
    refreshTokenExpiry: refreshExp,
  };
};

const storeRefreshToken = async ({ userId, jti, ttlSeconds }) => {
  const userSessionsKey = `user_sessions:${userId}`;
  const tokenKey = `refresh_token:${userId}:${jti}`;

  await redis.setex(tokenKey, ttlSeconds, "active");

  await redis.sadd(userSessionsKey, jti);
};

const getRefreshToken = async ({ userId, jti }) => {
  const key = `refresh_token:${userId}:${jti}`;

  return await redis.get(key);
};

const deleteRefreshToken = async ({ userId, jti }) => {
  const key = `refresh_token:${userId}:${jti}`;

  return await redis.del(key);
};

const revokeAllUserSessions = async (userId) => {
  const userSessionsKey = `user_sessions:${userId}`;

  const jtis = await redis.smembers(userSessionsKey);

  if (jtis.length > 0) {
    const keyToDeletes = jtis.map((jti) => `refresh_token:${userId}:${jti}`);
    keyToDeletes.push(userSessionsKey);

    await redis.del(...keyToDeletes);
  }
};

module.exports = {
  generateToken,
  storeRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  revokeAllUserSessions,
};
