const { DateTime } = require('luxon');
const { getNamespaces, getSettings } = require('../services/setting.service');
const {
  removeFromOnline,
  getOnlineRangeByScore,
  getOnlineSpaces,
} = require('../services/online.service');
const CronJob = require('cron').CronJob;

const removeOnlineTimeout = async () => {
  const namespaces = await getNamespaces();
  for (const namespace of namespaces) {
    const settings = await getSettings(namespace);
    const scoreNow = DateTime.now()
      .setZone('Asia/Hong_Kong')
      .toFormat('yyyyMMddHHmmssSSS');
    const spaces = await getOnlineSpaces({ settings, namespace });
    // if (spaces) {
    // console.log(
    //   `[${namespace}] Still have spaces, no online timeout user will be removed`,
    // );
    // continue;
    // }
    const queueIds = await getOnlineRangeByScore({
      start: '-inf',
      stop: scoreNow,
      namespace,
    });
    if (queueIds.length) {
      for (const queueId of queueIds) {
        await removeFromOnline({ namespace, queueId });
        // console.log(
        //   `[${namespace}] Online user with queueId: ${queueId} removed`,
        // );
      }
    }
  }
};

const removeOnlineTimeoutTask = new CronJob(
  '*/10 * * * * *',
  removeOnlineTimeout,
  null,
  false,
  'Asia/Hong_Kong',
);

module.exports = {
  removeOnlineTimeout,
  removeOnlineTimeoutTask,
};
