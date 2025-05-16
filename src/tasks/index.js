const { moveWaitingToOnBoardTask } = require('./move-waiting-to-onboard.task');
const { removeWaitingTimeoutTask } = require('./remove-waiting-timeout.task');
const { removeOnlineTimeoutTask } = require('./remove-online-timeout.task');
const { removeOnboardTimeoutTask } = require('./remove-onboard-timeout.task');

const startTasks = () => {
  moveWaitingToOnBoardTask.start();
  removeWaitingTimeoutTask.start();
  removeOnlineTimeoutTask.start();
  removeOnboardTimeoutTask.start();
};

module.exports = { startTasks };
