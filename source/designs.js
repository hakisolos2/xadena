const { command } = require('../lib');

const { heartDesign, weatherDesign, gemDesign, treeDesign, musicDesign, sportDesign, toolDesign, holidayDesign, dessertDesign, travelDesign, spaceDesign, fashionDesign, beverageDesign, instrumentDesign, gameDesign, emojiArtDesign, partyDesign, holidaySeasonDesign, fitnessDesign, technologyDesign, animalEmojiDesign, kissDesign, hugDesign, slapDesign, callConversation } = require('../lib/misc/designs');

command(
 {
  pattern: 'hrt',
  desc: 'Heart Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await heartDesign(message);
 }
);
command(
 {
  pattern: 'wth',
  desc: 'Weather Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await weatherDesign(message);
 }
);

command(
 {
  pattern: 'gem',
  desc: 'Gem Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await gemDesign(message);
 }
);

command(
 {
  pattern: 'tree',
  desc: 'Tree Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await treeDesign(message);
 }
);

command(
 {
  pattern: 'msc',
  desc: 'Music Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await musicDesign(message);
 }
);

command(
 {
  pattern: 'sts',
  desc: 'Sport Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await sportDesign(message);
 }
);

command(
 {
  pattern: 'tls',
  desc: 'Tool Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await toolDesign(message);
 }
);

command(
 {
  pattern: 'holi',
  desc: 'Holiday Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await holidayDesign(message);
 }
);

command(
 {
  pattern: 'desi',
  desc: 'Dessert Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await dessertDesign(message);
 }
);

command(
 {
  pattern: 'trv',
  desc: 'Travel Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await travelDesign(message);
 }
);

command(
 {
  pattern: 'spc',
  desc: 'Space Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await spaceDesign(message);
 }
);

command(
 {
  pattern: 'fas',
  desc: 'Fashion Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await fashionDesign(message);
 }
);

command(
 {
  pattern: 'bev',
  desc: 'Beverage Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await beverageDesign(message);
 }
);

command(
 {
  pattern: 'ist',
  desc: 'Instrument Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await instrumentDesign(message);
 }
);

command(
 {
  pattern: 'gs',
  desc: 'Game Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await gameDesign(message);
 }
);

command(
 {
  pattern: 'ert',
  desc: 'Emoji Art Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await emojiArtDesign(message);
 }
);

command(
 {
  pattern: 'pty',
  desc: 'Party Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await partyDesign(message);
 }
);

command(
 {
  pattern: 'hol',
  desc: 'Holiday Season Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await holidaySeasonDesign(message);
 }
);

command(
 {
  pattern: 'fit',
  desc: 'Fitness Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await fitnessDesign(message);
 }
);

command(
 {
  pattern: 'tec',
  desc: 'Technology Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await technologyDesign(message);
 }
);

command(
 {
  pattern: 'ani',
  desc: 'Animal Emoji Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await animalEmojiDesign(message);
 }
);

command(
 {
  pattern: 'kiss',
  desc: 'Kiss Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await kissDesign(message);
 }
);

command(
 {
  pattern: 'hug',
  desc: 'Hug Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await hugDesign(message);
 }
);

command(
 {
  pattern: 'slap',
  desc: 'Slap Designs',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await slapDesign(message);
 }
);

command(
 {
  pattern: 'call',
  desc: 'Initiate a call conversation',
  type: 'designs',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await callConversation(message);
 }
);
