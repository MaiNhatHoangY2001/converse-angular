FROM node:20-alpine as build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

COPY package.json .
RUN pnpm install
COPY . .
RUN pnpm run build:production
FROM nginx:latest
COPY --from=build app/dist/browser /usr/share/nginx/html
EXPOSE 80