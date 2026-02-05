# BotSkill - 多阶段构建
# Stage 1: 构建前端
FROM node:20-alpine AS client-builder

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
# 生产环境 API 使用同源 /api
ENV VITE_API_URL=/api
RUN npm run build

# Stage 2: 构建后端并整合
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY backend/ ./
COPY --from=client-builder /app/client/dist ./public

# Stage 3: 运行镜像
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --from=backend-builder /app/backend ./

USER nodejs

EXPOSE 3000

CMD ["node", "server.js"]
