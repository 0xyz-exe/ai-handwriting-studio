FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm install --omit=dev

COPY .next ./.next
COPY public ./public
COPY next.config.mjs ./

EXPOSE 3000

CMD ["npx", "next", "start"]
