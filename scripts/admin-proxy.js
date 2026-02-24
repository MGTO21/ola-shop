const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 9001;
const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://127.0.0.1:9000';

app.use(cors({
    origin: true,
    credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'static')));

const apiProxy = createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  ws: true,
});

app.use((req, res, next) => {
  if (!req.path.startsWith('/uploads')) {
    return apiProxy(req, res, next);
  }
  next();
});

app.listen(PORT, () => console.log('Proxy running on 9001'));
