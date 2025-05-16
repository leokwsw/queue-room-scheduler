const queue = require('../util/queue');
const hashMap = require('../util/hash-map');
const { getOnboardCount } = require('./onboard.service');
const redis = require('../common/redis');

const getOnlineCount = async ({ namespace }) => {
  return await queue.getCount({
    queue: 'online:queue',
    namespace,
  });
};

const removeFromOnline = async ({ namespace, queueId }) => {
  try {
    const pipeline = redis.pipeline();
    queue.removeFromQueue({
      queue: 'online:queue',
      namespace,
      queueId,
      pipeline,
    });
    hashMap.removeFromHashMap({
      key: 'online',
      queueId,
      namespace,
      pipeline,
    });
    await pipeline.exec();
  } catch (e) {
    console.log(e);
  }
};

const getOnlineRangeByScore = async ({ namespace, start, stop }) => {
  return await queue.getRangeByScore({
    queue: 'online:queue',
    start,
    stop,
    namespace,
  });
};

const getOnlineSpaces = async ({ settings, namespace }) => {
  const onlineCount = await getOnlineCount({ namespace });
  const onboardCount = await getOnboardCount({ namespace });
  const spaces = parseInt(settings.onlineLimit) - onlineCount - onboardCount;
  return spaces > 0 ? spaces : 0;
};

module.exports = {
  getOnlineCount,
  removeFromOnline,
  getOnlineRangeByScore,
  getOnlineSpaces,
};
