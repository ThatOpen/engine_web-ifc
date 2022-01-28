const handler = require('serve-handler');
const http = require('http');

const server = http.createServer((request, response) => {
    // this stuff is needed to get SharedArrayBuffer support, which in turn allows multi threading
    response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

  return handler(request, response);
})

server.listen(5000, () => {
  console.log('Running at http://localhost:5000');
});