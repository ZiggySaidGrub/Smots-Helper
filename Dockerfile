FROM node:lts AS runtime
WORKDIR /app

COPY . .

RUN npm install
RUN mkdir output

CMD node .
