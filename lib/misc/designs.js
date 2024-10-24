async function heartDesign(message) {
 const heartDesigns = ['❤️💛💚💙💜', '💖💕💓💗💞', '❤️‍🔥💘💝💟❣️', '🧡💛💚💙💜', '💗💖💘💕❤️'];
 const msg = await message.reply('❤️...');
 for (let i = 0; i < heartDesigns.length; i++) {
  await msg.edit(heartDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function starDesign(message) {
 const starDesigns = ['⭐🌟✨💫🌠', '🌟✨🌠⭐💫', '✨🌠⭐💫🌟', '💫⭐🌟🌠✨', '🌠✨🌟💫⭐'];
 const msg = await message.reply('⭐...');
 for (let i = 0; i < starDesigns.length; i++) {
  await msg.edit(starDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function moonDesign(message) {
 const moonDesigns = ['🌙🌕🌖🌗🌘', '🌕🌖🌗🌘🌑', '🌗🌘🌑🌒🌓', '🌘🌑🌒🌓🌔', '🌑🌒🌓🌔🌕'];
 const msg = await message.reply('🌙...');
 for (let i = 0; i < moonDesigns.length; i++) {
  await msg.edit(moonDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function flowerDesign(message) {
 const flowerDesigns = ['🌼🌸🌻🌺🌷', '🌸🌺🌼🌷🌻', '🌷🌻🌼🌸🌺', '🌻🌼🌺🌷🌸', '🌺🌷🌸🌼🌻'];
 const msg = await message.reply('🌼...');
 for (let i = 0; i < flowerDesigns.length; i++) {
  await msg.edit(flowerDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function animalDesign(message) {
 const animalDesigns = ['🐶🐱🐭🐹🐰', '🐾🐾🐾🐾🐾', '🐻🐼🐨🐯🦁', '🦄🐴🐺🦊🐗', '🐾🐾🦒🦓🐘'];
 const msg = await message.reply('🐶...');
 for (let i = 0; i < animalDesigns.length; i++) {
  await msg.edit(animalDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function foodDesign(message) {
 const foodDesigns = ['🍏🍎🍐🍊🍋', '🍌🍉🍇🍓🍈', '🍒🍑🥭🍍🍅', '🥥🥝🍠🍟🍕', '🍔🍣🌭🍩🍪'];
 const msg = await message.reply('🍏...');
 for (let i = 0; i < foodDesigns.length; i++) {
  await msg.edit(foodDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function flagDesign(message) {
 const flagDesigns = ['🇺🇸🇬🇧🇨🇦🇦🇺🇩🇪', '🇫🇷🇮🇹🇪🇸🇯🇵', '🇨🇳🇷🇺🇧🇷🇮🇳', '🇿🇦🇰🇷🇹🇷🇸🇬', '🇵🇹🇮🇸🇦🇹🇻🇦'];
 const msg = await message.reply('🇺🇸...');
 for (let i = 0; i < flagDesigns.length; i++) {
  await msg.edit(flagDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function vehicleDesign(message) {
 const vehicleDesigns = ['🚗🚕🚙🚌🚎', '🚓🚑🚒🚐🚚', '🚛🚜🏎️🛻🚍', '🚘🛵🛴🛺🦯', '🚌🚍🚎🚏🛣️'];
 const msg = await message.reply('🚗...');
 for (let i = 0; i < vehicleDesigns.length; i++) {
  await msg.edit(vehicleDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function weatherDesign(message) {
 const weatherDesigns = ['☀️🌤️⛅🌦️🌧️', '🌧️🌩️⛈️🌨️🌪️', '🌈🌤️☀️🌙⭐', '🌌🌠🌕🌑🌇', '🌄🌅🌉🏞️🏔️'];
 const msg = await message.reply('☀️...');
 for (let i = 0; i < weatherDesigns.length; i++) {
  await msg.edit(weatherDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function gemDesign(message) {
 const gemDesigns = ['💎💎💎💎💎', '💎✨💎✨💎', '💎🌟💎🌟💎', '✨💎💖💎✨', '💖✨💎💖✨'];
 const msg = await message.reply('💎...');
 for (let i = 0; i < gemDesigns.length; i++) {
  await msg.edit(gemDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function treeDesign(message) {
 const treeDesigns = ['🌳🌲🌴🌱🌿', '🌳🌲🌳🌲🌳', '🌴🌲🌳🌿🌱', '🌳🌲🌱🌿🌴', '🌿🌱🌳🌲🌴'];
 const msg = await message.reply('🌳...');
 for (let i = 0; i < treeDesigns.length; i++) {
  await msg.edit(treeDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function musicDesign(message) {
 const musicDesigns = ['🎶🎵🎤🎧🎸', '🎼🎹🎷🎻🥁', '🎺🎻🎶🎵🎼', '🎤🎧🎶🎶🎸', '🎵🎼🎹🎷🎤'];
 const msg = await message.reply('🎶...');
 for (let i = 0; i < musicDesigns.length; i++) {
  await msg.edit(musicDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function sportDesign(message) {
 const sportDesigns = ['⚽🏀🏈⚾🎾', '🏉🥇🏆🎱🥋', '🏌️‍♂️🏋️‍♀️🤸‍♂️🏊‍♀️🚴‍♂️', '🎳🏓🏸🏒🏏', '🏉🏐🥋🏆🏅'];
 const msg = await message.reply('⚽...');
 for (let i = 0; i < sportDesigns.length; i++) {
  await msg.edit(sportDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function toolDesign(message) {
 const toolDesigns = ['🔧🔨🪛🔩🔗', '🔨🔧🔗🪚🪝', '🔩🛠️🪚🔗🔧', '🔧🪓🔩🛠️🔨', '🔨🔧🔩🪛🧰'];
 const msg = await message.reply('🔧...');
 for (let i = 0; i < toolDesigns.length; i++) {
  await msg.edit(toolDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function holidayDesign(message) {
 const holidayDesigns = ['🎄🎉🎃🎆🎈', '🎅🎊🎇🎄🎁', '🎇🎆🎉🧨🥳', '🎊🎁🎂🎉🌟', '🥳🎈🎊🎄🎉'];
 const msg = await message.reply('🎄...');
 for (let i = 0; i < holidayDesigns.length; i++) {
  await msg.edit(holidayDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function dessertDesign(message) {
 const dessertDesigns = ['🍰🍩🍪🧁🍦', '🍨🍧🍰🎂🍮', '🍪🍦🍰🍩🍫', '🍮🍰🧁🍨🍧', '🧁🍰🍨🍩🍪'];
 const msg = await message.reply('🍰...');
 for (let i = 0; i < dessertDesigns.length; i++) {
  await msg.edit(dessertDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function travelDesign(message) {
 const travelDesigns = ['✈️🗺️🏖️🗽🏔️', '🏝️🏕️🌍🌆🌏', '🌇🏙️🗽✈️🚢', '🚀🛩️🏝️🚗🚅', '🗺️🏖️🏔️🕌🏞️'];
 const msg = await message.reply('✈️...');
 for (let i = 0; i < travelDesigns.length; i++) {
  await msg.edit(travelDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function spaceDesign(message) {
 const spaceDesigns = ['🌌✨🌠🌕🌑', '🌍🪐🚀🌟⭐', '🌒🌌🌟🌍🌙', '✨🌠🚀🌙🌌', '🛰️🌌🌕🔭🌠'];
 const msg = await message.reply('🌌...');
 for (let i = 0; i < spaceDesigns.length; i++) {
  await msg.edit(spaceDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function fashionDesign(message) {
 const fashionDesigns = ['👗👚👖👠👜', '👒👡👢👙🧥', '👠👟🩴👖🧣', '👜👗👖🕶️🧥', '👗👡👜🎒🧢'];
 const msg = await message.reply('👗...');
 for (let i = 0; i < fashionDesigns.length; i++) {
  await msg.edit(fashionDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function beverageDesign(message) {
 const beverageDesigns = ['☕🍵🧃🍺🍷', '🥛🍹🍸🍾🥤', '🍹🍷🍸🍺🥂', '🍻🍵🥃🍷☕', '🍶🥤🍻🍺🍸'];
 const msg = await message.reply('☕...');
 for (let i = 0; i < beverageDesigns.length; i++) {
  await msg.edit(beverageDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function instrumentDesign(message) {
 const instrumentDesigns = ['🎸🎻🎷🥁🎺', '🎹🎤🎼🎧🎻', '🎸🎤🎷🎹🎺', '🥁🎸🎷🎼🎤', '🎶🎼🎧🎹🎺'];
 const msg = await message.reply('🎸...');
 for (let i = 0; i < instrumentDesigns.length; i++) {
  await msg.edit(instrumentDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function gameDesign(message) {
 const gameDesigns = ['🎮🎲♟️🧩🎯', '🃏♠️♥️♦️♣️', '🎴🎲🎮🏆🏅', '🎮🎲♟️🧩🎯', '🏆🎮🎲🏅♟️'];
 const msg = await message.reply('🎮...');
 for (let i = 0; i < gameDesigns.length; i++) {
  await msg.edit(gameDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function emojiArtDesign(message) {
 const emojiArtDesigns = ['🎨🖌️🖍️🎨🖌️', '🖍️🎨🖌️🖌️🎨', '🖌️🎨🖍️🖍️🎨', '🎨🖌️🖍️🖌️🖍️', '🎨🎨🖌️🖌️🖍️'];
 const msg = await message.reply('🎨...');
 for (let i = 0; i < emojiArtDesigns.length; i++) {
  await msg.edit(emojiArtDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function partyDesign(message) {
 const partyDesigns = ['🎉🎊🎈🥳🎂', '🎂🎉🎊🎈🎈', '🥳🎈🎊🎉🍾', '🎈🎉🥳🎊🎂', '🎊🎂🍾🎈🎉'];
 const msg = await message.reply('🎉...');
 for (let i = 0; i < partyDesigns.length; i++) {
  await msg.edit(partyDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function holidaySeasonDesign(message) {
 const holidaySeasonDesigns = ['🎄🎅🤶🦌❄️', '🎁🎄🕯️🎅✨', '🧦🎄🎉🎊🎁', '🕯️🎄✨🎉🦌', '🎅🎁🌟🎄❄️'];
 const msg = await message.reply('🎄...');
 for (let i = 0; i < holidaySeasonDesigns.length; i++) {
  await msg.edit(holidaySeasonDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function fitnessDesign(message) {
 const fitnessDesigns = ['🏋️‍♂️🏃‍♀️🚴‍♂️🏊‍♀️🤸‍♂️', '🧘‍♂️🚴‍♀️🏋️‍♂️🤸‍♀️🏌️‍♂️', '🏃‍♂️🏋️‍♀️🚴‍♂️🏊‍♂️🤸‍♂️', '🏊‍♀️🏋️‍♂️🚴‍♀️🤸‍♀️🏃‍♂️', '🤸‍♂️🏋️‍♀️🏊‍♂️🚴‍♂️🏃‍♀️'];
 const msg = await message.reply('🏋️‍♂️...');
 for (let i = 0; i < fitnessDesigns.length; i++) {
  await msg.edit(fitnessDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function technologyDesign(message) {
 const technologyDesigns = ['💻🖥️📱🖲️⌨️', '🖥️💾📷📺💻', '💻🖲️📱💾⌨️', '📱💻🖥️🖲️💾', '⌨️💻🖥️📱🖥️'];
 const msg = await message.reply('💻...');
 for (let i = 0; i < technologyDesigns.length; i++) {
  await msg.edit(technologyDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function animalEmojiDesign(message) {
 const animalEmojiDesigns = ['🐶🐱🐭🐹🐰', '🐹🐰🐼🐻🐨', '🐸🐵🐷🦁🐻', '🐶🐱🐰🐹🦄', '🦁🐸🦄🐴🐒'];
 const msg = await message.reply('🐶...');
 for (let i = 0; i < animalEmojiDesigns.length; i++) {
  await msg.edit(animalEmojiDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}
async function kissDesign(message) {
 const kissDesigns = ['💋😘💏😍', '💋💖😘😍💕', '😍💋💘💖😘', '💏💖😘💞💋', '😘💞💖💋😍'];
 const msg = await message.reply('💋...');
 for (let i = 0; i < kissDesigns.length; i++) {
  await msg.edit(kissDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function hugDesign(message) {
 const hugDesigns = ['🤗💞💖💓', '🤗💖💘💕', '💖🤗💞💓💘', '💞🤗💖💓💘', '💖💞🤗💓💘'];
 const msg = await message.reply('🤗...');
 for (let i = 0; i < hugDesigns.length; i++) {
  await msg.edit(hugDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function slapDesign(message) {
 const slapDesigns = ['👋😠💢🤬', '💢👋😡😠', '👋🤬💢😡', '👋💢😠🤬', '😠💢👋🤬'];
 const msg = await message.reply('👋...');
 for (let i = 0; i < slapDesigns.length; i++) {
  await msg.edit(slapDesigns[i]);
  await new Promise((resolve) => setTimeout(resolve, 800));
 }
}

async function callConversation(message) {
 const conversationStages = ['📞 **Incoming Call**: You received a call from *John Doe*. Do you want to answer? (Type "yes" or "no")', '📞 **Call Accepted**: You are now on a call with *John Doe*. *What would you like to say?*', '💬 *John Doe*: Hey! How are you?', "💬 *You*: I'm doing great! How about you?", "💬 *John Doe*: I'm fine, thanks! Let's catch up!", '📞 **Call Ended**: You hung up the call.'];

 const msg = await message.reply(conversationStages[0]);

 const responses = ['yes', 'no'];

 for (let i = 1; i < conversationStages.length; i++) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (i === 1) {
   await msg.edit(conversationStages[i]);
   if (responses[0] === 'yes') {
    continue;
   } else {
    await msg.edit('📞 **Call Declined**: You have declined the call from *John Doe*.');
    return;
   }
  }
  await msg.edit(conversationStages[i]);
 }

 await new Promise((resolve) => setTimeout(resolve, 2000));
 await msg.edit(conversationStages[conversationStages.length - 1]);
}

module.exports = {
 heartDesign,
 weatherDesign,
 gemDesign,
 treeDesign,
 musicDesign,
 sportDesign,
 toolDesign,
 holidayDesign,
 dessertDesign,
 travelDesign,
 spaceDesign,
 fashionDesign,
 beverageDesign,
 instrumentDesign,
 gameDesign,
 emojiArtDesign,
 partyDesign,
 holidaySeasonDesign,
 fitnessDesign,
 technologyDesign,
 animalEmojiDesign,
 kissDesign,
 hugDesign,
 slapDesign,
 callConversation,
};
