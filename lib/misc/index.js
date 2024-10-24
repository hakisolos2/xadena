const fs = require('fs');
const path = require('path');
const TicTacToe = require('./ttt');
const WordChainGame = require('./wcg');
const TriviaGame = require('./trivia');
const RiddleGame = require('./riddle');

function getRandomFact() {
 const facts = JSON.parse(fs.readFileSync(path.join(__dirname, 'facts.json'), 'utf8')).facts;
 return facts[Math.floor(Math.random() * facts.length)];
}
function getRandomQuote() {
 const { quotes } = JSON.parse(fs.readFileSync(path.join(__dirname, 'quotes.json'), 'utf8'));
 const { quote, author } = quotes[Math.floor(Math.random() * quotes.length)];
 return `${quote} — ${author}`;
}
async function loader(message) {
 const loadingStages = ['ʟᴏᴀᴅɪɴɢ █▒▒▒▒▒▒▒▒▒▒▒ 𝟷𝟶%', 'ʟᴏᴀᴅɪɴɢ ████▒▒▒▒▒▒▒▒ 𝟹𝟶%', 'ʟᴏᴀᴅɪɴɢ ███████▒▒▒▒▒ 𝟻𝟶%', 'ʟᴏᴀᴅɪɴɢ ██████████▒▒ 𝟾𝟶%', 'ʟᴏᴀᴅɪɴɢ ████████████ 𝟷𝟶𝟶%', 'ʟᴏᴀᴅɪɴɢ ᴄᴏᴍᴘʟᴇᴛᴇ'];

 const msg = await message.reply('ʟᴏᴀᴅɪɴɢ...');
 for (let i = 0; i < loadingStages.length; i++) {
  await msg.edit(loadingStages[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}
module.exports = {
 getRandomFact,
 getRandomQuote,
 loader,
 TicTacToe,
 WordChainGame,
 TriviaGame,
 RiddleGame
};
