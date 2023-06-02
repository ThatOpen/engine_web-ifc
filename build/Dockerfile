FROM emscripten/emsdk:3.1.31
WORKDIR /web-ifc
COPY .. .
RUN npm i -g cpy-cli
RUN npm i
VOLUME [ "/web-ifc" ]
CMD [ "npm","run","build-release" ]