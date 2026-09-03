FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# We must build with the base URL configured, assuming the Nginx proxy handles /api
RUN npm run build

FROM nginx:alpine
# Copy the custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the built React app
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
