const { command } = require('../lib');
const fs = require('fs');
const path = require('path');
const { upload, isUrl, ssweb } = require('xstro');

command(
 {
  pattern: 'temp',
  desc: 'Clean temp folder',
  type: 'tools',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  const tempPath = path.join(__dirname, '..', 'lib', 'temp');
  const clearFiles = (folderPath) => fs.readdirSync(folderPath).forEach((file) => fs.unlinkSync(path.join(folderPath, file)));
  clearFiles(tempPath);
  return await message.reply('_Cache Cleared_');
 }
);

command(
 {
  pattern: 'upload',
  alias: 'url',
  desc: 'Get Url of an object',
  type: 'tools',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  if (!message.reply_message?.image && !message.reply_message?.video && !message.reply_message?.audio) return message.reply('_Reply Image/Video/Audio_');
  const media = await message.download(message.reply_message.data);
  const res = await upload(media.buffer);
  return await message.reply(res);
 }
);

command(
 {
  pattern: 'ssweb',
  desc: 'ScreenShot A Website',
  type: 'tools',
 },
 async (message, match) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  if (!match) return message.reply('_Provide Url_');
  if (!isUrl(match)) return message.reply('_Invaild Url_');
  const res = await ssweb(match);
  return await message.send(res);
 }
);
