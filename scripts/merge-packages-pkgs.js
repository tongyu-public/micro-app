const path = require('path');
const fs = require('fs');

const packagesPath = path.join(__dirname, '..', 'src', 'packages');
console.log('packagesPath', packagesPath);

let dependencies = {};
fs.readdirSync(packagesPath).forEach((pkgName) => {
  console.log('pkgName', pkgName);
  const pkgMetaPath = path.join(packagesPath, pkgName, 'package.json');
  const pkgMeta = JSON.parse(
    fs.readFileSync(pkgMetaPath, {
      encoding: 'utf-8',
    }),
  );
  console.log('pkgMetaPath', pkgMetaPath);
  dependencies = {
    ...dependencies,
    ...pkgMeta.dependencies,
  };
});

console.log(dependencies);
