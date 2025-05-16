const dotenv = require('dotenv');
dotenv.config();

const redisConfig = require('./redis.config');

module.exports = {
  redis: redisConfig
};
