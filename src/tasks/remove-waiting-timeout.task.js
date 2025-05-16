const { DateTime } = require('luxon');
const { getNamespaces } = require('../services/setting.service');
const {
  getWaitingTimeoutRangeByScore,
  removeFromWaiting,
} = require('../services/waiting.service');
const CronJob = require('cron').CronJob;

const removeWaitingTimeout = async () => {
  const namespaces = await getNamespaces();
  for (const namespace of namespaces) {
    const scoreNow = DateTime.now()
      .setZone('Asia/Hong_Kong')
      .toFormat('yyyyMMddHHmmssSSS');
    const queueIds = await getWaitingTimeoutRangeByScore({
      start: '-inf',
      stop: scoreNow,
      namespace,
    });
    if (queueIds.length) {
      for (const queueId of queueIds) {
        await removeFromWaiting({ namespace, queueId });
      }
    }
  }
};

const removeWaitingTimeoutTask = new CronJob(
  '*/30 * * * * *',
  removeWaitingTimeout,
  null,
  false,
  'Asia/Hong_Kong',
);

module.exports = {
  removeWaitingTimeout,
  removeWaitingTimeoutTask,
};
