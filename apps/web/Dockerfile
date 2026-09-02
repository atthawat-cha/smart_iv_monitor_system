# Stub Dockerfile — fill in once dependencies are installed (pnpm install at repo root).
FROM node:20-alpine

WORKDIR /app
COPY . .
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
