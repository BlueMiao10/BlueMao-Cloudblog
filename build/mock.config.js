const fs = require('fs')
const path = require('path')

const mockBaseURL = 'http://note-server.hunger-valley.com'
const realBAseURL = 'http://note-server.hunger-valley.com'

exports.config = function ({isDev = true} = {isDev: true}) {
  let fileTxt = `module.exports = {
    baseURL:'${isDev ? mockBaseURL : realBAseURL}'
  }`
  fs.writeFileSync(path.join(__dirname, '../src/helper/config-baseURL.js'), fileTxt)
}
