# Angular 16 requiere Node 18 para compilar. Uso exclusivamente académico/legacy.
FROM node:18-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
ARG ANGULAR_API_URL=http://localhost:4000/api
ARG REACT_APP_URL=http://localhost:5173
ENV ANGULAR_API_URL=${ANGULAR_API_URL}
ENV REACT_APP_URL=${REACT_APP_URL}
RUN node -e "const fs=require('fs');const p='src/environments/environment.ts';let s=fs.readFileSync(p,'utf8');s=s.replace('http://localhost:4000/api',process.env.ANGULAR_API_URL).replace('http://localhost:5173',process.env.REACT_APP_URL);fs.writeFileSync(p,s);"
RUN npm run build
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/pa3-tareas /usr/share/nginx/html
EXPOSE 80
