const projectName = require('./project');

const config = {
  app1: {
    localPath: './src/project/app1/',
  },
  app2: {
    localPath: './src/project/app2/',
  },
};

const configObj = config[projectName.name];
module.exports = configObj;
