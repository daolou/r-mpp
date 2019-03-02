FROM node:10.13-alpine
# 设置工作目录
WORKDIR /var/nodejs/r-mpp

# 将package.json拷贝到docker里
COPY package.json ./

# 安装依赖
RUN npm install --silent

# 拷贝源代码到docker工作目录
COPY . .

# 打包静态资源
RUN npm run pre-build

# 将静态资源从docker中复制出来
COPY /var/nodejs/r-mpp/dists/ ./dists/

# 暴露容器端口
# EXPOSE 8091
