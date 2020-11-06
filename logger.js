const fs = require('fs')
const moment = require('moment')

const file = fs.createWriteStream(`${process.env.LOG_DIRECTORY}.log`, { flags: 'a' })

/**
 * 
 * @param {'log' | 'error'} type 
 * @param {string} text 
 */
function append_log(type, text) {
  const line = `[${type === 'log' ? 'info' : type}][${moment().utc().format()}] - ${text}`

  console[type](line)

  file.write(line)
  file.write('\n')
}

exports.log = text => append_log('log', text)
exports.error = text => append_log('error', text)
