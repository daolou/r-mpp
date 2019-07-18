const path = require('path');
const projectConfig = require('../config/projectConfig');
const isDev = process.env.NODE_ENV == 'development';

module.exports = {
  entry: projectConfig.localPath + 'app.js',
  public: isDev ? '/' : `/${projectConfig.remotePath}/`,
  defaultTemp: `${projectConfig.localPath}/document.njk`,
  currentTemp: path.resolve(projectConfig.localPath, '../', './document.njk'),
  assets: path.resolve(projectConfig.localPath, './assets'),
  data: projectConfig.data,
};
