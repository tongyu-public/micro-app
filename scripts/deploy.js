const shell = require('shelljs');

const distPathMaps = {
  dev: '/etc/nginx/dist-swap',
  test: '/etc/nginx/dist-swap',
};

const hostMaps = {
  dev: '10.1.6.80',
  dev2: '10.1.6.84',
  dev3: '10.1.5.159',
  test: '10.1.6.69',
};

const host = hostMaps[process.env.DEPLOY_ENV] || hostMaps.dev;
const distPath = distPathMaps[process.env.DEPLOY_ENV] || distPathMaps.dev;

console.log('host', host);
console.log('distPath', distPath);
console.log('开始删除远程服务器 dist 目录');
if (shell.exec(`ssh root@${host} "rm -rf ${distPath}"`).code === 0) {
  console.log('删除目录成功');
  console.log('开始上传本地包到远程 dist 目录');
  if (shell.exec(`scp -r ./dist root@${host}:${distPath}`).code === 0) {
    console.log('上传目录成功');
  } else {
    console.log('上传目录成功');
  }
} else {
  console.log('删除目录失败');
}
