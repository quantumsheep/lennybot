const fs = require('fs')
const moment = require('moment')

const directory = fs.promises.mkdir('/var/log/lennybot', { recursive: true })

/** @type {import('fs').WriteStream} */
let file = null;

/**
 * 
 * @param {'log' | 'error'} type 
 * @param {string} text 
 */
async function append_log(type, text) {
  if (file === null) {
    await directory
    file = fs.createWriteStream(`/var/log/lennybot/${moment().format('YYYY-MM-DD')}.log`, { flags: 'a+' })
  }

  const line = `[${type === 'log' ? 'info' : type}][${moment().utc().format()}] - ${text}`

  console[type](line)

  file.write(line)
  file.write('\n')
}

exports.log = text => append_log('log', text)
exports.error = text => append_log('error', text)
