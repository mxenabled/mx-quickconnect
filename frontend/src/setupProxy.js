const { createProxyMiddleware } = require('http-proxy-middleware');

const filter = function (pathname, req) {
  return pathname.match('/api') || pathname.match('/users/');
};

module.exports = function(app) {
  app.use(
    createProxyMiddleware(filter, {
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );
};
