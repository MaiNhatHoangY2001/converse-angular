FROM node:20-alpine as build

# (Optional) Install build dependencies if needed by your project
RUN apk add --no-cache python3 make g++

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy both package.json and lock file (if present)
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

COPY . .
RUN pnpm run build:production

FROM nginx:latest
COPY --from=build /app/dist/browser /usr/share/nginx/html
EXPOSE 80
