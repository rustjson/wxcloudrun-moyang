# 二开推荐阅读[如何提高项目构建效率](https://developers.weixin.qq.com/miniprogram/dev/wxcloudrun/src/scene/build/speed.html)
FROM node:20-alpine

# 容器默认时区为UTC，如需使用上海时间请启用以下时区设置命令
# RUN apk add tzdata && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo Asia/Shanghai > /etc/timezone

# 启用 corepack 并激活 pnpm，避免 shell 重新加载问题
RUN corepack enable && corepack prepare pnpm@10.8.1 --activate


# # 指定工作目录
WORKDIR /app

# pnpm 源，选用国内镜像源以提高下载速度
RUN pnpm config set registry https://mirrors.cloud.tencent.com/npm/
# RUN pnpm config set registry https://registry.npm.taobao.org/


## 优化缓存：先复制包管理文件再安装依赖
COPY package*.json /app/
RUN pnpm install --frozen-lockfile || pnpm install

# 再复制源码
COPY . /app

# 构建前端
RUN pnpm build

# 执行启动命令
# 写多行独立的CMD命令是错误写法！只有最后一行CMD命令会被执行，之前的都会被忽略，导致业务报错。
# 请参考[Docker官方文档之CMD命令](https://docs.docker.com/engine/reference/builder/#cmd)
CMD ["pnpm", "start"]
