const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const redis = require("../config/redisConfig");
const clientWarningEmail = require("../helper/clientWarningEmail");
const { sendEmail } = require("../helper/sendEmail");

const MAX_ALLOWED_ATTEMPTS = 5;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60;

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

const storeRefreshToken = async ({ userId, jti, ttlSecond }) => {
  const userSessionsKey = `user_sessions:${userId}`;
  const tokenKey = `refresh_token:${userId}:${jti}`;

  await redis.setex(tokenKey, ttlSecond, "active");

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

const recordFailedLogin = async ({ ip, email }) => {
  const lockWindowSeconds = 900;
  const key = `failed_logins:${ip}:${email}`;

  const count = await redis.incr(key);

  if (count) {
    await redis.expire(key, lockWindowSeconds);
  }
  return count;
};

const getFailedLoginCount = async ({ ip, email }) => {
  const key = `failed_logins:${ip}:${email}`;

  const count = await redis.get(key);

  return count ? parseInt(count, 10) : 0;
};

const resetFailedLogins = async ({ ip, email }) => {
  const key = `failed_logins:${ip}:${email}`;

  await redis.del(key);
};

const handleFailedAttempt = async ({ ip, email, sendWarning }) => {
  const count = await recordFailedLogin({ ip, email });

  if (count >= MAX_ALLOWED_ATTEMPTS && sendWarning) {
    await sendEmail({
      to: email,
      subject: "Security Warning From HoangAnWebsite",
      html: clientWarningEmail(),
    });
  }
  return count;
};

module.exports = {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  MAX_ALLOWED_ATTEMPTS,
  generateToken,
  storeRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  revokeAllUserSessions,
  recordFailedLogin,
  getFailedLoginCount,
  resetFailedLogins,
  handleFailedAttempt,
};
