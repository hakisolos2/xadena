const fs = require('fs').promises;
const path = require('path');
const config = require('./config');
const { makeSession } = require('./lib');
async function readAndRequireFiles(directory) {
 const files = await fs.readdir(directory);
 return await Promise.all(
  files
   .filter((file) => path.extname(file) === '.js')
   .map(async (file) => {
    try {
     return require(path.join(directory, file));
    } catch (error) {
     const filePath = path.join(directory, file);
     const errorLocation = error.stack.split('\n')[1].trim();
     console.error(`Error in file: ${filePath}\nError at: ${errorLocation}`);
    }
   })
 );
}

async function initialize() {
 await readAndRequireFiles(path.join(__dirname, '/lib/store/'));
 console.log('Syncing Database');
 await config.DATABASE.sync();
 console.log('⬇  Installing Plugins...');
 await readAndRequireFiles(path.join(__dirname, '/source/'));
 console.log('📑 Plugins Installed!');
 await makeSession(config.SESSION_ID).then(console.log);
 const WhatsAppBot = require('./lib/bot');
 const bot = new WhatsAppBot();
 return bot.connect();
}

initialize();
