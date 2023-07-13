FROM node:18-alpine as deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --silent

FROM node:18-alpine as build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM nginx:1.13.12-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]