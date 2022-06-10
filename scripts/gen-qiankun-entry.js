const path = require('path');
const fs = require('fs');

const distPath = path.join(__dirname, '..', 'dist');

const indexHTMLPath = path.join(distPath, 'index.html');
const indexQianKunHTMLPath = path.join(distPath, 'index-slave.html');

if (!fs.existsSync(indexHTMLPath)) {
  throw new Error('index.html not found');
}

const htmlStr = fs.readFileSync(indexHTMLPath, 'utf8');

const slavePublicPath = 'receipt-admin';

const next = htmlStr
  .replace(/<script src="\//g, `<script src="/${slavePublicPath}/`)
  .replace(/<link rel="stylesheet" href="\//g, `<link rel="stylesheet" href="/${slavePublicPath}/`)
  .replace(
    /window\.publicPath = window\.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ \|\| "\/";/,
    `window.publicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || "/${slavePublicPath}/";`,
  );

fs.writeFileSync(indexQianKunHTMLPath, next, 'utf-8');
