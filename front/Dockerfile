FROM docker.io/library/node:22 as build

WORKDIR /app
COPY package.json package-lock.json /app/

RUN npm ci

COPY . /app/
RUN npm run build

FROM docker.io/library/nginx:1

WORKDIR /usr/share/nginx

RUN rm -rf html
RUN mkdir html

WORKDIR /

COPY ./nginx/nginx.conf /etc/nginx
COPY --from=build /app/dist /usr/share/nginx/html
