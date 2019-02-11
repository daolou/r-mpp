// 根据命令行输入(`npm run deploy projectName`)获取工程名
const fs = require('fs');
let projectName = process.argv[2];
if (!projectName) {
  projectName = require('./project').name;
  if (projectName == 'undefined' || !projectName) {
    const chalk = require('chalk');
    console.log(chalk.red('请输入要部署的工程名'));
    process.exit(1);
  }
} else {
  fs.writeFileSync('./config/project.js', `exports.name = '${projectName}';\r\n`);
}

const spawnSync = require('child_process').spawnSync;
const projectConfig = require('../config/projectConfig');
const distDirectory = '/data/workspace/disperse/' + projectConfig.remotePath;
if (fs.existsSync(distDirectory)) {
  spawnSync('rm', ['-R', distDirectory]);
}
const execSync = require('child_process').execSync;
execSync(`npm run build && cp -r ./dist/ ${distDirectory}`, {
  stdio: 'inherit',
});
