const { createProxyMiddleware } = require('http-proxy-middleware');

const envTarget = process.env.DOCKER_PROXY_URL || "localhost"

const filter = function (pathname, req) {
  return pathname.match('/api') || pathname.match('/users/');
};

module.exports = function(app) {
  app.use(
    createProxyMiddleware(filter, {
      target: `http://${envTarget}:8000`,
      changeOrigin: true,
    })
  );
};
