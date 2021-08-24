FROM emscripten/emsdk:2.0.25
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src src
COPY wasm wasm
COPY tsconfig.json .