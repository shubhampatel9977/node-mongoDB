const rateLimit = require('express-rate-limit');

const rateLimiterOptions = {
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
};

const configureRateLimiter = () => {
  return rateLimit(rateLimiterOptions);
};

module.exports = configureRateLimiter;