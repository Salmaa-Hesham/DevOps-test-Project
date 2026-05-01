# 1. Base image
FROM node:alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy dependency files
COPY package*.json ./

# 4. Install dependencies
RUN npm install
# 5. Copy application code
COPY . .

# 6. Expose port
EXPOSE 5000

# 7. Start application
CMD ["node" , "server.js"]