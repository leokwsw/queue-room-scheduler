const {
  moveWaitingToOnBoard,
} = require('./tasks/move-waiting-to-onboard.task');
const { removeOnlineTimeout } = require('./tasks/remove-online-timeout.task');
const { removeWaitingTimeout } = require('./tasks/remove-waiting-timeout.task');
const { removeOnboardTimeout } = require('./tasks/remove-onboard-timeout.task');

const main = async () => {
  await removeOnlineTimeout();
  await removeWaitingTimeout();
  await removeOnboardTimeout();
  await moveWaitingToOnBoard();
  process.exit();
};

main();
