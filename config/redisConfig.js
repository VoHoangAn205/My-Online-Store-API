const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL, {
  retryStrategy: (times) => {
    return Math.min(times * 50, 2000);
  },
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) =>
  console.log("Redis connection failed: ", err.message),
);

module.exports = redis;
