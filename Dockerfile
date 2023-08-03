FROM emscripten/emsdk:3.1.44
WORKDIR /web-ifc-app
COPY package*.json .
RUN npm i -g cpy-cli
RUN npm i
COPY . .
RUN npm run build-release
EXPOSE 3000
ENTRYPOINT [ "npm", "run", "dev" ]