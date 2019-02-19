// 根据命令行输入(`npm run deploy projectName`)获取工程名
const path = require('path');
let projectName = process.argv[2];
if (!projectName) {
  projectName = require('./project').name;
  if (projectName == 'undefined' || !projectName) {
    const chalk = require('chalk');
    console.log(chalk.red('请输入要部署的工程名'));
    process.exit(1);
  }
} else {
  const fs = require('fs');
  fs.writeFileSync('./config/project.js', `exports.name = '${projectName}';\n`);
}

const projectConfig = require('../config/projectConfig');
const originDirectory = path.resolve(__dirname, '../dist/');
const execSync = require('child_process').execSync;
execSync(
  `npm run build && nd push ${originDirectory} ${projectConfig.remotePath} -b ${
    projectConfig.bucket
  }`,
  {
    stdio: 'inherit',
  }
);
