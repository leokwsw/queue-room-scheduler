const redis = require('../common/redis');

const addToHashMap = async ({
  key,
  queueId,
  payload,
  namespace = 'main',
  pipeline = null,
}) => {
  if (typeof payload === 'object') {
    payload = JSON.stringify(payload);
  }
  if (pipeline) {
    return pipeline.hset(`${namespace}:${key}`, queueId, payload);
  }
  return await redis.hset(`${namespace}:${key}`, queueId, payload);
};
const removeFromHashMap = async ({
  key,
  queueId,
  namespace = 'main',
  pipeline = null,
}) => {
  if (pipeline) {
    return pipeline.hdel(`${namespace}:${key}`, queueId);
  }
  return await redis.hdel(`${namespace}:${key}`, queueId);
};

const getHashMapValue = async ({ key, queueId, namespace = 'main' }) => {
  return await redis.hget(`${namespace}:${key}`, queueId);
};

module.exports = {
  addToHashMap,
  removeFromHashMap,
  getHashMapValue,
};
