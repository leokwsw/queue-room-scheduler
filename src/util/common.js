const { v4: uuidv4 } = require('uuid');

const generateQueueId = () => {
  return uuidv4();
};

module.exports = {
  generateQueueId,
};
