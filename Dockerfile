FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json vite.config.ts tsconfig.json tsconfig.node.json index.html ./
RUN npm install
COPY src ./src
COPY public ./public
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html/sportlife
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
