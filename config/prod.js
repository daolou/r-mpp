const projectConfig = require('../scripts/projectConfig');

console.log(projectConfig);

module.exports = {
  pageURL: `https://${projectConfig.bucket}/${projectConfig.remotePath}`,
  app1: 'https://app1xxx',
};
