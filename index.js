const { readdirSync, statSync } = require('fs')
const { resolve, extname, dirname } = require('path')

const parentDir = dirname(module.parent.filename)

module.exports = (directory) => {
  delete require.cache[__filename]

  const dir = directory || '.'
  const absDir = resolve(parentDir, dir)

  let files = readdirSync(absDir)
    .map(file => ({
      path: resolve(absDir, file),
      ext: extname(file),
    }))
    .filter(file => file.ext === '.js')
    .forEach((file) => {
      if (statSync(file.path).isDirectory()) {
        files = [
          ...files,
          requireAll(file.path),
        ]
      }
    })
  return files.map(file => require(file.path))
}
