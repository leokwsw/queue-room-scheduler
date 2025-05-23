const http = require('http');
const { startTasks } = require('./tasks');

startTasks();

/**
 * Native HTTP server for health check only
 */
http
  .createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end();
  })
  .listen(8080);

console.log('Server running at http://127.0.0.1:8080/');
