const path = require('path')

const root = path.join(__dirname, '..')
const srcPath = path.join(root, 'src')
const modulePath = path.join(root, 'node_modules')
const buildPath = path.join(root, 'build')

module.exports = {
  srcPath,
  modulePath,
  buildPath,
}
