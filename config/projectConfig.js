
const projectName = require('./project')

const config = {
  app1:{
    localPath:'./src/controller/app1/',
  },
  app2:{
    localPath:'./src/controller/app2/',
  },
}

const configObj = config[projectName.name]
module.exports = configObj
