const fs = require('fs/promises');
const config = require('../../config');
const crypto = require('crypto');
const path = require('path');
const FileType = require('file-type');
const { SudoDB, getBan } = require('../store');
const { Sequelize } = require('sequelize');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const { getBuffer, imageToWebp, writeExifVid, videoToWebp, writeExifImg, toAudio, decodeJid } = require('../utils');
const { downloadContentFromMessage, proto, generateWAMessageFromContent } = require('baileys');
ffmpeg.setFfmpegPath(ffmpegPath);

class Handler {
 constructor(client, data) {
  this.client = client;
  this.outputDir = path.join(__dirname, '..', 'temp');
  this._patch(data);
  this.ready = this._asyncPatch(data);
 }

 _patch(data) {
  this.data = data;
  this.key = data.key;
  this.id = data.key.id;
  this.jid = data.key.remoteJid;
  this.participant = decodeJid(data.sender);
  this.sender = data.pushName;
  this.user = decodeJid(this.client.user.id);
  this.fromMe = data.key.fromMe;
  this.isGroup = data.isGroup;
  this.timestamp = data.messageTimestamp?.low || data.messageTimestamp || Date.now();
  this.text = data.body || '';
  this.prefix = config.PREFIX;
  try {
   this.sudo = config.SUDO.split(',').includes(this.participant.split('@')[0]);
  } catch {
   this.sudo = false;
  }
  this.owner = this.fromMe || this.sudo;
  if (data.message) this._processMessageContent(data);
 }

 async _asyncPatch() {
  if (this.participant) {
   const dbSudo = await Handler.isSudo(this.participant);
   this.sudo = this.sudo || dbSudo;
  }
  if (this.participant) {
   const dbBan = await this.isBan(this.participant);
   this.isban = dbBan;
  }
  this.owner = this.fromMe || this.sudo;
  this.mode = await this.getMode(this.owner, this.participant);
 }

 _processMessageContent(data) {
  const typeKey = Object.keys(data.message)[0];
  this.type = typeKey.replace('Message', '').toLowerCase();
  this.message = data.message[typeKey];
  this.body = data.body || '';
  this.mention = this.message?.contextInfo?.mentionedJid || [];

  const mediaTypes = ['image', 'video', 'audio', 'document', 'sticker'];
  this.mediaType = mediaTypes.includes(this.type) ? this.type : 'text';
  this.mediaUrl = this.message?.url || null;
  this.fileSize = this.message?.fileLength || null;
  this.caption = this.message?.caption || null;
  this.mimetype = this.message?.mimetype || null;

  if (data.quoted) this._processQuotedMessage(data.quoted);
 }

 _processQuotedMessage(quoted) {
  const mediaTypes = {
   imageMessage: 'image',
   videoMessage: 'video',
   audioMessage: 'audio',
   documentMessage: 'document',
   stickerMessage: 'sticker',
  };

  const message = quoted.message;
  const mediaType = Object.keys(mediaTypes).find((key) => message[key]) || 'text';
  this.reply_message = {
   data: message,
   key: quoted.key,
   sender: quoted.key.participant,
   contextInfo: message?.extendedTextMessage?.contextInfo || message?.contextInfo || {},
   caption: message?.imageMessage?.caption || message?.videoMessage?.caption || message?.documentMessage?.caption || null,
   mediaType,
   viewonce: Boolean(quoted.type === 'view_once'),
   text: message?.conversation || message?.extendedTextMessage?.text || '',
   isText: !!(message?.conversation || message?.extendedTextMessage?.text),
   image: mediaType === 'image' || !!message?.imageMessage,
   video: mediaType === 'video' || !!message?.videoMessage,
   audio: mediaType === 'audio' || !!message?.audioMessage,
   document: mediaType === 'document' || !!message?.documentMessage,
   sticker: mediaType === 'sticker' || !!message?.stickerMessage,
  };
 }

 async reply(text, options = {}) {
  let messageContent = { text };
  if (options.mentions) messageContent.mentions = options.mentions;
  const message = await this.client.sendMessage(this.jid, messageContent, { quoted: this.data, ...options });
  return new Handler(this.client, message);
 }

 async react(emoji) {
  return this.client.sendMessage(this.jid, { react: { text: emoji, key: this.key } });
 }

 async edit(text, opt = {}) {
  return this.client.sendMessage(this.jid, { text, edit: this.key }, opt);
 }

 async getMode(owner, user) {
  if (config.MODE.toLowerCase() === 'private') {
   return owner === true;
  } else if (config.MODE.toLowerCase() === 'public') {
   return owner === true || user === true;
  } else {
   return false;
  }
 }

 static isSudo(userId) {
  if (!userId) return false;
  const cleanedId = userId.split('@')[0];
  const result = SudoDB.sequelize
   .query('SELECT COUNT(*) AS count FROM sudos WHERE userId = :userId', {
    replacements: { userId: cleanedId },
    type: Sequelize.QueryTypes.SELECT,
   })
   .then((result) => {
    return result.length > 0 && result[0].count > 0;
   })
   .catch((error) => {
    console.error('Error checking sudo status:', error);
    return false;
   });

  return result;
 }

 async isBan(userId) {
  const bannedUser = await getBan(userId);
  return !!bannedUser;
 }

 static createInteractiveMessage(data, options = {}) {
  const { jid, button, header, footer, body } = data;
  let buttons = [];
  for (let i = 0; i < button.length; i++) {
   let btn = button[i];
   let Button = {};
   Button.buttonParamsJson = JSON.stringify(btn.params);
   switch (btn.type) {
    case 'copy':
     Button.name = 'cta_copy';
     break;
    case 'url':
     Button.name = 'cta_url';
     break;
    case 'location':
     Button.name = 'send_location';
     break;
    case 'address':
     Button.name = 'address_message';
     break;
    case 'call':
     Button.name = 'cta_call';
     break;
    case 'reply':
     Button.name = 'quick_reply';
     break;
    case 'list':
     Button.name = 'single_select';
     break;
    default:
     Button.name = 'quick_reply';
     break;
   }
   buttons.push(Button);
  }
  const mess = {
   viewOnceMessage: {
    message: {
     messageContextInfo: {
      deviceListMetadata: {},
      deviceListMetadataVersion: 2,
     },
     interactiveMessage: proto.Message.InteractiveMessage.create({
      body: proto.Message.InteractiveMessage.Body.create({ ...body }),
      footer: proto.Message.InteractiveMessage.Footer.create({ ...footer }),
      header: proto.Message.InteractiveMessage.Header.create({ ...header }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
       buttons: buttons,
      }),
     }),
    },
   },
  };
  let optional = generateWAMessageFromContent(jid, mess, options);
  return optional;
 }

 async sendInteractive(content) {
  const genMessage = Handler.createInteractiveMessage(content);
  await this.client.relayMessage(this.jid, genMessage.message, { messageId: genMessage.key.id });
 }

 async send(content, options = {}) {
  const jid = options.jid || this.jid;

  const getContentBuffer = async (content) => {
   if (Buffer.isBuffer(content)) return content;
   if (typeof content === 'string' && content.startsWith('http')) {
    return await getBuffer(content);
   }
   return Buffer.from(content);
  };

  const ensureBuffer = async (input) => {
   const buffer = await getContentBuffer(input);
   if (!Buffer.isBuffer(buffer)) {
    throw new Error('Failed to convert content to a valid buffer.');
   }
   return buffer;
  };

  const detectMimeType = async (buffer) => {
   if (typeof buffer === 'string') {
    return 'text/plain';
   }
   try {
    const fileType = await FileType.fromBuffer(buffer);
    return fileType ? fileType.mime : 'application/octet-stream';
   } catch {
    return 'application/octet-stream';
   }
  };

  const sendText = (text, options) => {
   return this.client.sendMessage(jid, { text, ...options });
  };

  const sendImage = (buffer, options) => {
   return this.client.sendMessage(jid, { image: buffer, ...options });
  };

  const sendVideo = (buffer, options) => {
   return this.client.sendMessage(jid, { video: buffer, ...options });
  };

  const sendAudio = (buffer, options) => {
   return this.client.sendMessage(jid, { audio: buffer, mimetype: 'audio/mp4', ...options });
  };

  const sendDocument = (buffer, options) => {
   return this.client.sendMessage(jid, {
    document: buffer,
    mimetype: options.mimetype || 'application/octet-stream',
    fileName: options.filename || 'file',
    ...options,
   });
  };

  const sendSticker = async (buffer, options) => {
   let stickerBuffer = buffer;
   const fileType = await FileType.fromBuffer(buffer);
   const isWebp = fileType?.mime === 'image/webp';

   if (isWebp) {
    stickerBuffer = await writeExifImg(buffer, options);
   } else {
    stickerBuffer = await imageToWebp(buffer);
    stickerBuffer = await writeExifImg(stickerBuffer, options);
   }
   if (typeof stickerBuffer === 'string') stickerBuffer = await fs.readFile(stickerBuffer);
   return this.client.sendMessage(jid, { sticker: stickerBuffer, ...options });
  };

  const sendVideoAsAudio = async (buffer, options) => {
   const audioBuffer = await toAudio(buffer);
   return sendAudio(audioBuffer, options);
  };

  const sendVideoAsSticker = async (buffer, options = {}) => {
   let stickerBuffer;
   const fileType = await FileType.fromBuffer(buffer);
   const isWebp = fileType?.mime === 'image/webp';

   if (isWebp) {
    stickerBuffer = await writeExifImg(buffer, options);
   } else {
    stickerBuffer = await videoToWebp(buffer);
    stickerBuffer = await writeExifVid(stickerBuffer, options);
   }
   if (typeof stickerBuffer === 'string') stickerBuffer = await fs.readFile(stickerBuffer);
   return this.client.sendMessage(jid, { sticker: stickerBuffer, ...options });
  };

  try {
   let buffer;
   let mimeType;

   if (typeof content === 'string' && !content.startsWith('http')) {
    buffer = content;
    mimeType = 'text/plain';
   } else {
    buffer = await ensureBuffer(content);
    mimeType = await detectMimeType(buffer);
   }

   const contentType = options.type || mimeType.split('/')[0];

   const sendOptions = {
    quoted: this.data,
    caption: options.caption,
    contextInfo: options.contextInfo,
    ...options,
   };

   switch (contentType) {
    case 'text':
     return sendText(typeof buffer === 'string' ? buffer : buffer.toString(), sendOptions);
    case 'image':
     return options.asSticker ? sendSticker(buffer, sendOptions) : sendImage(buffer, sendOptions);
    case 'video':
     if (options.asSticker || contentType === 'sticker') {
      return sendVideoAsSticker(buffer, sendOptions);
     }
     if (options.asAudio) {
      return sendVideoAsAudio(buffer, sendOptions);
     }
     return sendVideo(buffer, sendOptions);
    case 'audio':
     return sendAudio(buffer, sendOptions);
    case 'document':
     return sendDocument(buffer, sendOptions);
    case 'sticker':
     return sendSticker(buffer, sendOptions);
    default:
     return sendDocument(buffer, { ...sendOptions, mimetype: mimeType });
   }
  } catch (error) {
   console.error('Error sending message:', error);
   throw new Error('Invalid Media: ' + error.message);
  }
 }

 async download(message = this.reply_message?.data) {
  const msg = message || this.reply_message?.data;
  const mimeMap = {
   imageMessage: 'image',
   videoMessage: 'video',
   stickerMessage: 'sticker',
   documentMessage: 'document',
   audioMessage: 'audio',
  };

  const type = Object.keys(mimeMap).find((key) => msg[key]);
  if (!type) return null;

  const mediaType = mimeMap[type];
  const stream = await downloadContentFromMessage(msg[type], mediaType);

  const buffer = Buffer.concat(await this.streamToBuffer(stream));
  const mimeType = msg[type].mimetype;

  const extensions = {
   'image/jpeg': 'jpg',
   'image/png': 'png',
   'video/mp4': 'mp4',
   'audio/ogg; codecs=opus': 'ogg',
   'application/pdf': 'pdf',
   'image/webp': 'webp',
  };

  const fileExtension = extensions[mimeType] || 'bin';
  const fileName = `${mediaType}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${fileExtension}`;
  const filePath = path.join(this.outputDir, fileName);

  await fs.mkdir(this.outputDir, { recursive: true });
  await fs.writeFile(filePath, buffer);

  return { buffer, filePath, mediaType, fileSize: buffer.length };
 }

 async streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return chunks;
 }
 async forward(jid, content, options = {}) {
  if (options.readViewOnce) {
   content = content?.ephemeralMessage?.message || content;
   const viewOnceKey = Object.keys(content)[0];
   delete content?.ignore;
   delete content?.viewOnceMessage?.message?.[viewOnceKey]?.viewOnce;
   content = {
    ...content?.viewOnceMessage?.message,
   };
  }

  if (options.mentions) {
   content[getContentType(content)].contextInfo.mentionedJid = options.mentions;
  }

  const forwardContent = generateForwardMessageContent(content, false);
  const contentType = getContentType(forwardContent);

  const forwardOptions = {
   ptt: options.ptt,
   waveform: options.audiowave,
   seconds: options.seconds,
   fileLength: options.fileLength,
   caption: options.caption,
   contextInfo: options.contextInfo,
  };

  if (options.mentions) {
   forwardOptions.contextInfo.mentionedJid = options.mentions;
  }

  if (contentType !== 'conversation') {
   forwardOptions.contextInfo = content?.message[contentType]?.contextInfo || {};
  }

  forwardContent[contentType].contextInfo = {
   ...forwardOptions.contextInfo,
   ...forwardContent[contentType]?.contextInfo,
  };

  const waMessage = generateWAMessageFromContent(jid, forwardContent, {
   ...forwardContent[contentType],
   ...forwardOptions,
  });
  return await this.client.relayMessage(jid, waMessage.message, {
   messageId: waMessage.key.id,
  });
 }

 async copyNForward(jid, message, options = {}) {
  const msg = generateWAMessageFromContent(jid, message, {
   ...options,
   userJid: this.client.user.id,
  });
  msg.message.contextInfo = options.contextInfo || {};
  await this.client.relayMessage(jid, msg.message, {
   messageId: msg.key.id,
   ...options,
  });
  return msg;
 }
}

module.exports = Handler;
