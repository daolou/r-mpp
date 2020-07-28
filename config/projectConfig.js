const projectName = require('./project');

// const CDN = 'xxxxx';

/**
 * localPath: 本地工程根目录
 * remotePath: 远程cdn目录
 * bucket: 上传到cdn的桶(bucket)
 */
const config = {
  app1: {
    localPath: './src/project/app1/',
    remotePath: 'activity4/app1',
    bucket: 'xxx.xxx.xxx',
    data: {
      title: 'app1',
      ga_id: 'xxxxx',
    },
  },
  app2: {
    localPath: './src/project/app2/',
    remotePath: 'activity4/app2',
    bucket: 'xxx.xxx.xxx',
    data: {
      title: 'app2',
      ga_id: 'xxxxx',
    },
  },
};

const configObj = config[projectName.name];
module.exports = configObj;
