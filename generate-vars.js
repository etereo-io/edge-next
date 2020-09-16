fs = require('fs')
 
const myArgs = process.argv.slice(2)
const buf = Buffer.from(myArgs[0], 'base64')

fs.appendFileSync('.env', buf.toString())