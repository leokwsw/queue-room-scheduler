const { DateTime } = require('luxon');
const { getNamespaces } = require('../services/setting.service');
const {
  getOnboardRangeByScore,
  removeFromOnboard,
} = require('../services/onboard.service');
const CronJob = require('cron').CronJob;

const removeOnboardTimeout = async () => {
  const namespaces = await getNamespaces();
  for (const namespace of namespaces) {
    const scoreNow = DateTime.now()
      .setZone('Asia/Hong_Kong')
      .toFormat('yyyyMMddHHmmssSSS');
    const queueIds = await getOnboardRangeByScore({
      start: '-inf',
      stop: scoreNow,
      namespace,
    });
    if (queueIds.length) {
      for (const queueId of queueIds) {
        await removeFromOnboard({ namespace, queueId });
      }
    }
  }
};

const removeOnboardTimeoutTask = new CronJob(
  '*/10 * * * * *',
  removeOnboardTimeout,
  null,
  false,
  'Asia/Hong_Kong',
);

module.exports = {
  removeOnboardTimeout,
  removeOnboardTimeoutTask,
};
