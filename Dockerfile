# 基础镜像为node，版本为v9.2.0
FROM node:16.20.1

# 复制 package.json 和 package-lock.json 文件到工作目录
COPY package*.json ./
RUN npm install

# 将项目文件复制到工作目录
COPY . .

# 容器对外暴露的端口号，要和node项目配置的端口号一致
EXPOSE 3000

# 容器启动时执行的命令
CMD ["npm", "run", "serve"]