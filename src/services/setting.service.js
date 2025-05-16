const dotenv = require('dotenv');
dotenv.config();
const redis = require('../common/redis');

const getSettings = async (namespace = 'main') => {
  let settings = await redis.hgetall(`${namespace}:settings`);
  return settings;
};

const getNamespaces = async () => {
  const namespaces = [];
  const keys = await redis.keys('*:settings');
  keys.forEach((key) => {
    namespaces.push(key.replace(':settings', ''));
  });
  return namespaces;
};

module.exports = {
  getSettings,
  getNamespaces,
};
