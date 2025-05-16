const CronJob = require('cron').CronJob;
const { getNamespaces, getSettings } = require('../services/setting.service');
const {
  getWaitingForOnboard,
  removeFromWaiting,
} = require('../services/waiting.service');
const { addToOnboard } = require('../services/onboard.service');
const { getOnlineSpaces } = require('../services/online.service');

const moveWaitingToOnBoard = async () => {
  const namespaces = await getNamespaces();

  for (const namespace of namespaces) {
    const settings = await getSettings(namespace);
    const spaces = await getOnlineSpaces({ settings, namespace });
    if (!spaces) {
      // console.log('No available spaces');
      return;
    }
    const users = await getWaitingForOnboard({
      numberOfUser: spaces,
      namespace,
    });
    if (users.length) {
      for (const user of users) {
        // TODO: Send push to user
        const { queueId, ip, userAgent } = user;
        await removeFromWaiting({ queueId, namespace });
        await addToOnboard({
          queueId,
          settings,
          namespace,
          ip,
          userAgent,
        });
      }
    }
  }
};

const moveWaitingToOnBoardTask = new CronJob(
  '*/10 * * * * *',
  moveWaitingToOnBoard,
  null,
  false,
  'Asia/Hong_Kong',
);

module.exports = {
  moveWaitingToOnBoardTask,
  moveWaitingToOnBoard,
};
