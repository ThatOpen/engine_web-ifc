FROM emscripten/emsdk:2.0.25
WORKDIR /app
COPY package*.json ./
# RUN npm i -g cpy-cli
RUN npm ci
COPY src src
COPY wasm wasm
COPY tsconfig.json .
# RUN npm run build-release
# EXPOSE 3000
# ENTRYPOINT [ "npm", "run", "dev" ]