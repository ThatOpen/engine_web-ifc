FROM emscripten/emsdk:3.1.31
WORKDIR /web-ifc
COPY package*.json .
RUN npm i -g cpy-cli ts-node typescript make-dir esbuild
RUN npm i
EXPOSE 3000
VOLUME [ "/web-ifc" ]