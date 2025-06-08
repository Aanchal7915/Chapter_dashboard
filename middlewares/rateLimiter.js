const Redis = require('redis');
require('dotenv').config();
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});
redisClient.connect();

const RATE_LIMIT = parseInt(process.env.RATE_LIMIT); // Maximum requests per window
const WINDOW_SIZE = parseInt(process.env.WINDOW_SIZE); // Time window in seconds

const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const key = `rate_limit_log:${ip}`;
    const now = Date.now();
    const windowStart = now - WINDOW_SIZE * 1000;

    await redisClient.zRemRangeByScore(key, 0, windowStart);
    const currentCount = await redisClient.zCard(key);

    if (currentCount >= RATE_LIMIT) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    await redisClient.zAdd(key, [{ score: now, value: `${now}` }]);
    await redisClient.expire(key, WINDOW_SIZE);
    next();
  }
  catch (e) {
    console.error('Rate limiter error:', e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = rateLimiter
