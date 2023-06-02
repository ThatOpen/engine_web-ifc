FROM emscripten/emsdk:3.1.31
WORKDIR /web-ifc
COPY ../package*.json .
RUN npm i -g cpy-cli
RUN npm i
VOLUME [ "/web-ifc" ]