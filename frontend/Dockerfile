# Stage 1: install dependencies
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


# Stage 2: run frontend with Vite
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
