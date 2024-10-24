const { command, parsedJid, isAdmin } = require('../lib');

command(
 {
  pattern: 'add',
  desc: 'Add a person to group',
  type: 'group',
 },
 async (message, match, m, client) => {
  if (!message.mode) return;
  if (!message.isGroup) return message.reply(group);
  if (message.isban) return message.reply(ban);
  if (!message.owner) return message.reply(owner);
  match = match || message.reply_message.sender;
  if (!match) return await message.reply('_Mention a user to add_');
  const isadmin = await isAdmin(message.jid, message.user, client);
  if (!isadmin) return await message.reply("_I'm not admin_");
  const jid = parsedJid(match);
  await client.groupParticipantsUpdate(message.jid, jid, 'add');
  return await message.reply(`_@${jid[0].split('@')[0]} added_`, { mentions: [jid] });
 }
);

command(
 {
  pattern: 'kick',
  desc: 'Kick a person from group',
  type: 'group',
 },
 async (message, match, m, client) => {
  if (!message.mode) return;
  if (!message.isGroup) return message.reply(group);
  if (message.isban) return message.reply(ban);
  if (!message.owner) return message.reply(owner);
  match = match || message.reply_message.sender;
  if (!match) return await message.reply('_Mention a user to kick_');
  const isadmin = await isAdmin(message.jid, message.user, client);
  if (!isadmin) return await message.reply("_I'm not admin_");
  const jid = parsedJid(match);
  await client.groupParticipantsUpdate(message.jid, jid, 'remove');
  return await message.reply(`_@${jid[0].split('@')[0]} kicked_`, { mentions: [jid] });
 }
);

command(
 {
  pattern: 'promote',
  desc: 'Promote to admin',
  type: 'group',
 },
 async (message, match, m, client) => {
  if (!message.mode) return;
  if (!message.isGroup) return message.reply(group);
  if (message.isban) return message.reply(ban);
  if (!message.owner) return message.reply(owner);
  match = match || message.reply_message.sender;
  if (!match) return await message.reply('_Mention a user to promote_');
  const isadmin = await isAdmin(message.jid, message.user, client);
  if (!isadmin) return await message.reply("_I'm not admin_");
  const jid = parsedJid(match);
  await client.groupParticipantsUpdate(message.jid, jid, 'promote');
  return await message.reply(`_@${jid[0].split('@')[0]} promoted to admin_`, { mentions: [jid] });
 }
);

command(
 {
  pattern: 'demote',
  desc: 'Demote from admin',
  type: 'group',
 },
 async (message, match, m, client) => {
  if (!message.mode) return;
  if (!message.isGroup) return message.reply(group);
  if (message.isban) return message.reply(ban);
  if (!message.owner) return message.reply(owner);
  match = match || message.reply_message.sender;
  if (!match) return await message.reply('_Mention a user to demote_');
  const isadmin = await isAdmin(message.jid, message.user, client);
  if (!isadmin) return await message.reply("_I'm not admin_");
  const jid = parsedJid(match);
  await client.groupParticipantsUpdate(message.jid, jid, 'demote');
  return await message.reply(`_@${jid[0].split('@')[0]} demoted from admin_`, { mentions: [jid] });
 }
);

command(
 {
  pattern: 'mute',
  desc: 'Mute group',
  type: 'group',
 },
 async (message, match, m, client) => {
  if (!message.mode) return;
  if (!message.isGroup) return message.reply(group);
  if (message.isban) return message.reply(ban);
  if (!message.owner) return message.reply(owner);
  const isadmin = await isAdmin(message.jid, message.user, client);
  if (!isadmin) return await message.reply("_I'm not admin_");
  await message.reply('_Muting the group_');
  return await client.groupSettingUpdate(message.jid, 'announcement');
 }
);

command(
 {
  pattern: 'unmute',
  desc: 'Unmute group',
  type: 'group',
 },
 async (message, match, m, client) => {
  if (!message.mode) return;
  if (!message.isGroup) return message.reply(group);
  if (message.isban) return message.reply(ban);
  if (!message.owner) return message.reply(owner);
  const isadmin = await isAdmin(message.jid, message.user, client);
  if (!isadmin) return await message.reply("_I'm not admin_");
  await message.reply('_Unmuting the group_');
  return await client.groupSettingUpdate(message.jid, 'not_announcement');
 }
);

command(
 {
  pattern: 'gjid',
  desc: 'Get JIDs of all group members',
  type: 'group',
 },
 async (message, match) => {
  if (!message.mode) return;
  if (!message.isGroup) return message.reply(group);
  if (message.isban) return message.reply(ban);
  if (!message.owner) return message.reply(owner);
  const { participants } = await message.client.groupMetadata(message.jid);
  const participantJids = participants.map((u) => u.id);
  let result = '╭──〔 *Group JIDs* 〕\n';
  participantJids.forEach((jid) => {
   result += `├ *${jid}*\n`;
  });
  result += `╰──────────────`;
  return await message.reply(result);
 }
);

command(
 {
  pattern: 'tagall',
  desc: 'Mention all users in group',
  type: 'group',
 },
 async (message, match) => {
  if (!message.mode) return;
  if (!message.isGroup) return message.reply(group);
  if (message.isban) return message.reply(ban);
  if (!message.owner) return message.reply(owner);
  const { participants } = await message.client.groupMetadata(message.jid);
  let mentionsText = '';
  participants.forEach((mem) => {
   mentionsText += ` @${mem.id.split('@')[0]}\n`;
  });
  return await message.reply(mentionsText.trim(), { mentions: participants.map((p) => p.id) });
 }
);

command(
 {
  pattern: 'tag',
  desc: 'Tag users with custom message',
  type: 'group',
 },
 async (message, match, m, client) => {
  if (!message.mode) return;
  if (!message.isGroup) return message.reply(group);
  if (message.isban) return message.reply(ban);
  if (!message.owner) return message.reply(owner);
  let taggedMsg = match || message.reply_message?.text || '';
  if (!taggedMsg) return await message.reply('_Reply A Message Or Give Me Text_');
  const { participants } = await client.groupMetadata(message.jid);
  return await message.reply(taggedMsg, { mentions: participants.map((p) => p.id) });
 }
);

command(
 {
  pattern: 'gname',
  desc: 'Change group name',
  type: 'group',
 },
 async (message, match, m, client) => {
  if (!message.mode) return;
  if (!message.isGroup) return message.reply(group);
  if (message.isban) return message.reply(ban);
  if (!message.owner) return message.reply(owner);
  if (!match) return await message.reply('_Provide a name to change the group name_');
  const isadmin = await isAdmin(message.jid, message.user, client);
  if (!isadmin) return await message.reply("_I'm not admin_");
  await client.groupUpdateSubject(message.jid, match);
  return await message.reply(`_Group name changed to: ${match}_`);
 }
);

command(
 {
  pattern: 'gdesc',
  desc: 'Change group description',
  type: 'group',
 },
 async (message, match, m, client) => {
  if (!message.mode) return;
  if (!message.isGroup) return message.reply(group);
  if (message.isban) return message.reply(ban);
  if (!message.owner) return message.reply(owner);
  if (!match) return await message.reply('_Provide a description to change the group description_');
  const isadmin = await isAdmin(message.jid, message.user, client);
  if (!isadmin) return await message.reply("_I'm not admin_");
  await client.groupUpdateDescription(message.jid, match);
  return await message.reply('_Group description updated_');
 }
);

command(
 {
  pattern: 'requests',
  desc: 'Show pending join requests',
  type: 'group',
 },
 async (message, match, m, client) => {
  if (!message.mode) return;
  if (!message.isGroup) return message.reply(group);
  if (message.isban) return message.reply(ban);
  if (!message.owner) return message.reply(owner);
  const isadmin = await isAdmin(message.jid, message.user, client);
  if (!isadmin) return await message.reply("_I'm not admin_");
  const requests = await client.groupRequestParticipantsList(message.jid);
  if (requests.length === 0) return await message.reply('_No pending join requests_');
  let requestList = 'Pending Join Requests:\n';
  requests.forEach((request, index) => {
   requestList += `${index + 1}. @${request.jid.split('@')[0]}\n`;
  });
  return await message.reply(requestList, { mentions: requests.map((r) => r.jid) });
 }
);

command(
 {
  pattern: 'accept',
  desc: 'Accept join request',
  type: 'group',
 },
 async (message, match, m, client) => {
  if (!message.mode) return;
  if (!message.isGroup) return message.reply(group);
  if (message.isban) return message.reply(ban);
  if (!message.owner) return message.reply(owner);
  if (!match) return await message.reply('_Provide the number or @tag of the request to accept_');
  const isadmin = await isAdmin(message.jid, message.user, client);
  if (!isadmin) return await message.reply("_I'm not admin_");
  const jid = parsedJid(match)[0];
  await client.groupRequestParticipantsUpdate(message.jid, [jid], 'approve');
  return await message.reply(`_Join request for @${jid.split('@')[0]} accepted_`, { mentions: [jid] });
 }
);

command(
 {
  pattern: 'reject',
  desc: 'Reject join request',
  type: 'group',
 },
 async (message, match, m, client) => {
  if (!message.mode) return;
  if (!message.isGroup) return message.reply(group);
  if (message.isban) return message.reply(ban);
  if (!message.owner) return message.reply(owner);
  if (!match) return await message.reply('_Provide the number or @tag of the request to reject_');
  const isadmin = await isAdmin(message.jid, message.user, client);
  if (!isadmin) return await message.reply("_I'm not admin_");
  const jid = parsedJid(match)[0];
  await client.groupRequestParticipantsUpdate(message.jid, [jid], 'reject');
  return await message.reply(`_Join request for @${jid.split('@')[0]} rejected_`, { mentions: [jid] });
 }
);

command(
 {
  pattern: 'newgc',
  desc: 'Create a new group',
  type: 'group',
 },
 async (message, match, m, client) => {
  if (message.isban) return message.reply(ban);
  if (!message.mode) return;
  if (!message.owner) return message.reply(owner);
  if (!match) return await message.reply('_Provide a name for the new group_');
  const participants = message.mention && message.mention.length > 0 ? message.mention : message.reply_message ? [message.reply_message.sender] : [message.user];
  const group = await client.groupCreate(match, participants);
  await message.reply(`_New group "${match}" created_`);
  return await client.sendMessage(group.id, { text: `_New Group ${match} Created_` });
 }
);

command(
 {
  pattern: 'leave',
  desc: 'Leave the group',
  type: 'group',
 },
 async (message, match, m, client) => {
  if (!message.mode) return;
  if (!message.isGroup) return message.reply(group);
  if (message.isban) return message.reply(ban);
  if (!message.owner) return message.reply(owner);
  await message.reply('_Leaving the group. Goodbye!_');
  return await client.groupLeave(message.jid);
 }
);
