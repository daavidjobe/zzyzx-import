const fs = require('fs')
const path = require('path')

const parentDir = path.dirname(module.parent.filename)

const requireAll = (directory) => {
  delete require.cache[__filename]

  const dir = directory || '.'
  const absDir = path.resolve(parentDir, dir)

  let files = fs.readdirSync(absDir)
    .map(file => ({
      path: path.resolve(absDir, file),
      ext: path.extname(file),
    }))
    .filter(file => file.ext === '.js')
    .forEach((file) => {
      if (fs.statSync(file.path).isDirectory()) {
        files = [
          ...files,
          requireAll(file.path),
        ]
      }
    })
  return files.map(file => require(file.path))
}

module.exports = requireAll
