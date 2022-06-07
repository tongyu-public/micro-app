const micromatch = require('micromatch');
const path = require('path');

const isWindows = typeof process !== 'undefined' && process.platform === 'win32';

const filter = (tool) => (files) => {
  const prefix = isWindows ? process.cwd().split(path.sep).join('/') : process.cwd();

  const match = micromatch.not(files, [`${prefix}/public/**`, `${prefix}/theme/**`]);
  console.log(`${tool} ${match.join(' ')}`);
  return `${tool} ${match.join(' ')}`;
};

module.exports = {
  '**/*.less': filter('yarn lint:style'),
  '**/*.{js,jsx,ts,tsx}': filter('yarn lint:code'),
  '**/*.{js,jsx,tsx,ts,less,md,json}': filter('prettier --write'),
};
