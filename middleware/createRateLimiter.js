const redis = require("../config/redisConfig");

const createRateLimiter = ({ windowSeconds, maxRequests, keyPrefix }) => {
  return async (req, res, next) => {
    const ip = req.ip === "::1" ? "127.0.0.1" : req.ip.replace("::ffff:", "");
    const key = `rateLimit:${keyPrefix}:${ip}`;

    try {
      const requests = await redis.incr(key);

      if (requests === 1) {
        await redis.expire(key, windowSeconds);
      }

      const ttl = await redis.tll(key);
      res.setHeader("X-RateLimit-Limit", maxRequests);
      res.setHeader(
        "X-RateLimit-Remaining",
        Math.max(0, maxRequests - requests),
      );
      res.setHeader("X-RateLimit-Reset", ttl);

      if (requests >= maxRequests) {
        return res.status(429).json({
          message: `Too many request, please try again in ${ttl} seconds`,
        });
      }

      next();
    } catch (err) {
      console.error("Rate limiter error");
      next();
    }
  };
};
