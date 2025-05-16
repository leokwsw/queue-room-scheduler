const { DateTime } = require('luxon');
const queue = require('../util/queue');
const hashMap = require('../util/hash-map');
const redis = require('../common/redis');

const getOnboardCount = async ({ namespace }) => {
  return await queue.getCount({
    queue: 'onboard:queue',
    namespace,
  });
};

const addToOnboard = async ({
  queueId,
  settings,
  namespace,
  ip,
  userAgent,
}) => {
  try {
    const expiryTime = DateTime.now()
      .setZone('Asia/Hong_Kong')
      .plus({
        seconds: parseInt(settings.onboardMaxIdleTime),
      });
    const pipeline = redis.pipeline();
    queue.addToQueue({
      queue: 'onboard:queue',
      queueId,
      score: expiryTime.toFormat('yyyyMMddHHmmssSSS'),
      namespace,
      pipeline,
    });
    hashMap.addToHashMap({
      key: 'onboard',
      queueId,
      payload: {
        ip,
        userAgent,
        createdAt: DateTime.now()
          .setZone('Asia/Hong_Kong')
          .toFormat('yyyy-MM-dd HH:mm:ss'),
        expiryAt: expiryTime.toFormat('yyyy-MM-dd HH:mm:ss'),
      },
      namespace,
      pipeline,
    });
    await pipeline.exec();
  } catch (e) {
    console.log(e);
  }
};

const removeFromOnboard = async ({ queueId, namespace }) => {
  try {
    const pipeline = redis.pipeline();
    hashMap.removeFromHashMap({
      key: 'onboard',
      queueId,
      namespace,
      pipeline,
    });
    queue.removeFromQueue({
      queue: 'onboard:queue',
      queueId,
      namespace,
      pipeline,
    });
    await pipeline.exec();
  } catch (e) {
    console.log(e);
  }
};

const getOnboardRangeByScore = async ({ namespace, start, stop }) => {
  return await queue.getRangeByScore({
    queue: 'onboard:queue',
    start,
    stop,
    namespace,
  });
};

module.exports = {
  getOnboardCount,
  addToOnboard,
  removeFromOnboard,
  getOnboardRangeByScore,
};
