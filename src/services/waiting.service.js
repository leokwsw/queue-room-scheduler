const queue = require('../util/queue');
const hashMap = require('../util/hash-map');
const redis = require('../common/redis');

const getWaitingForOnboard = async ({ numberOfUser, namespace }) => {
  const users = [];
  const queueIds = await queue.getByRange({
    queue: 'waiting:queue',
    stop: numberOfUser - 1,
    namespace,
  });
  for (const queueId of queueIds) {
    const user = await hashMap.getHashMapValue({
      key: 'waiting',
      queueId,
      namespace,
    });
    users.push({ queueId, ...JSON.parse(user) });
  }
  return users;
};

const removeFromWaiting = async ({ queueId, namespace }) => {
  try {
    const pipeline = redis.pipeline();
    hashMap.removeFromHashMap({
      key: 'waiting',
      queueId,
      namespace,
      pipeline,
    });
    queue.removeFromQueue({
      queue: 'waiting:queue',
      queueId,
      namespace,
      pipeline,
    });
    queue.removeFromQueue({
      queue: 'waiting:timeout',
      queueId,
      namespace,
      pipeline,
    });
    await pipeline.exec();
  } catch (e) {
    console.log(e);
  }
};

const getWaitingTimeoutRangeByScore = async ({ namespace, start, stop }) => {
  return await queue.getRangeByScore({
    queue: 'waiting:timeout',
    start,
    stop,
    namespace,
  });
};

const getWaitingCount = async ({ namespace }) => {
  return await queue.getCount({
    queue: 'waiting:queue',
    namespace,
  });
};

module.exports = {
  getWaitingForOnboard,
  removeFromWaiting,
  getWaitingTimeoutRangeByScore,
  getWaitingCount,
};
