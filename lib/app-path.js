const path = require('path')

module.exports = () => {
  const pkg = require(path.resolve(process.cwd(), 'package.json'))

  if (process.platform === 'darwin') {
    return path.resolve(process.cwd(), 'out', `${pkg.name}-${process.platform}-${process.arch}`, `${pkg.name}.app`, 'Contents/MacOS', pkg.name)
  } else if (process.platform === 'linux') {
    return path.resolve(process.cwd(), 'out', `${pkg.name}-${process.platform}-${process.arch}`, pkg.name)
  }

  throw new Error(`Unsupported platform ${process.platform}`)
}
