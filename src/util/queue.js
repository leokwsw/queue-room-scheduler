const redis = require('../common/redis');

const addToQueue = async ({
  queue,
  queueId,
  score,
  namespace = 'main',
  pipeline = null,
}) => {
  if (pipeline) {
    return pipeline.zadd(`${namespace}:${queue}`, score, queueId);
  }
  return await redis.zadd(`${namespace}:${queue}`, score, queueId);
};

const removeFromQueue = async ({
  queue,
  queueId,
  namespace = 'main',
  pipeline = null,
}) => {
  if (pipeline) {
    return pipeline.zrem(`${namespace}:${queue}`, queueId);
  }
  return await redis.zrem(`${namespace}:${queue}`, queueId);
};

const getIndex = async ({ queue, queueId, namespace = 'main' }) => {
  return await redis.zrank(`${namespace}:${queue}`, queueId);
};

const getCount = async ({ queue, namespace }) => {
  const count = await redis.zcount(`${namespace}:${queue}`, '-inf', '+inf');
  return count;
};

const getByRange = async ({ queue, start = 0, stop, namespace }) => {
  return await redis.zrange(`${namespace}:${queue}`, start, stop);
};

const getRangeByScore = async ({ queue, start, stop, namespace }) => {
  return await redis.zrangebyscore(`${namespace}:${queue}`, start, stop);
};

module.exports = {
  addToQueue,
  removeFromQueue,
  getIndex,
  getCount,
  getByRange,
  getRangeByScore,
};
