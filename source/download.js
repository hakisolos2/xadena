const { twitter } = require('xstro');
const { command } = require('../lib');

command(
 {
  pattern: 'twitter ?(.*)',
  desc: 'downloads x videos',
  type: 'download',
 },
 async (message, match) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  if (!match || !match.includes('x.com')) return message.reply('_Not Vaild Twitter URl!_');
  await message.reply('_Downloading_');
  const res = await twitter(match);
  return await message.send(res);
 }
);
