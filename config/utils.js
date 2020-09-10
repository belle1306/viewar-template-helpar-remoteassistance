const webpack = require('webpack');
const path = require('path');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [new webpack.DefinePlugin(env)],
  };
};

const root = path.join(__dirname, '..');
const srcPath = path.join(root, 'src');
const buildPath = path.join(root, 'build');

const getViewARConfig = () => {
  let config = null;
  try {
    config = JSON.parse(fs.readFileSync(path.join(root, 'viewar-config.json')));
  } catch (e) {}

  if (!config) {
    try {
      config = JSON.parse(fs.readFileSync(path.join(root, '.viewar-config')));
    } catch (e) {}
  }

  if (!config) {
    // eslint-disable-next-line no-console
    console.error(
      '[ViewAR] ERROR: File viewar-config.json not existing or invalid JSON format.'
    );

    config = {};
  }

  return config;
};

const printLaunchQRCode = (ip, port) => {
  const { appId, appVersion } = getViewARConfig();
  const url = `viewarsdk://sdk/ID:${appId}/version:${appVersion}/debug:true/debugIP:${ip}//debugPort:${port}`;
  console.log(url);

  qrcode.generate(url, { small: true });
};

module.exports = {
  printLaunchQRCode,
  getViewARConfig,
  setFreeVariable,
  srcPath,
  buildPath,
};
