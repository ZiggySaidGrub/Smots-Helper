FROM node:lts AS runtime
WORKDIR /app

COPY . .

RUN npm install

CMD node .