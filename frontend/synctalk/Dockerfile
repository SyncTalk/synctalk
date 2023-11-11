FROM node as build-react

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm clean-install

COPY . /app

RUN npm run-script build


FROM nginx as build-nginx

COPY --from=build-react /app/build /usr/share/nginx/html
