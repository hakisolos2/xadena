const axios = require('axios')
const fs = require('fs')
const unzipper = require('unzipper')
const path = require('path')

async function makeSession(sessionKey) {
  const downloadPath = path.join(__dirname, `${sessionKey}.zip`)
  const extractPath = path.join(__dirname, '../session')

  const res = await axios
    .post(
      'https://session-jvu4.onrender.com/api/download',
      { sessionKey },
      { responseType: 'stream' }
    )
    .catch(() => console.log('Invalid session'))
  if (!res) return

  await new Promise(resolve => {
    res.data.pipe(fs.createWriteStream(downloadPath)).on('finish', resolve)
  })

  await fs
    .createReadStream(downloadPath)
    .pipe(unzipper.Extract({ path: extractPath }))
    .promise()
  fs.unlinkSync(downloadPath)
  return 'Session connected'
}
module.exports = { makeSession }
