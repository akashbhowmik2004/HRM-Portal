FROM node:22.14.0-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html/hrmportal
COPY nginx.conf /etc/nginx/conf.d/default.conf