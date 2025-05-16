FROM node:16-alpine

RUN apk update && apk add tzdata
ENV TZ=Asia/Hong_Kong

RUN apk --no-cache add git
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

COPY --chown=node:node . .

CMD ["npm", "start"]

EXPOSE 8080