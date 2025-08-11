FROM node:20-alpine

RUN apk add --no-cache bash openssl netcat-openbsd

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["sh", "/usr/src/app/entrypoint.sh"]

