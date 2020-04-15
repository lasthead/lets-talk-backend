FROM node:10
WORKDIR /server
COPY ./package.json ./
COPY . .
RUN ls
RUN yarn install
RUN yarn build
