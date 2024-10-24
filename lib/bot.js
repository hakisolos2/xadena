const pino = require('pino');
const path = require('path');
const plugins = require('./plugins');
const { default: makeWASocket, useMultiFileAuthState, Browsers, delay, makeCacheableSignalKeyStore, DisconnectReason } = require('baileys');
const config = require('../config');
const { serialize } = require('./serialize');
const { Handler, Greetings } = require('./client');
const { loadMessage, saveMessage, saveChat, getName, getPausedChats } = require('./store');
const { commands } = require('./plugins');

class WhatsAppBot {
	constructor() {
		this.logger = pino({ level: 'silent' });
		this.conn = null;
	}

	async connect() {
		const sessionDir = './session';
		const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, sessionDir));

		this.conn = makeWASocket({
			auth: {
				creds: state.creds,
				keys: makeCacheableSignalKeyStore(state.keys, this.logger),
			},
			printQRInTerminal: false,
			logger: this.logger,
			browser: Browsers.macOS('HAKI'),
			downloadHistory: false,
			syncFullHistory: false,
			markOnlineOnConnect: false,
			emitOwnEvents: true,
			version: [2, 3000, 1017531287],
			getMessage: async (key) => (loadMessage(key.id) || {}).message || { conversation: null },
			patchMessageBeforeSending: (message) => {
				const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage);
				if (requiresPatch) {
					message = {
						viewOnceMessage: {
							message: {
								messageContextInfo: {
									deviceListMetadataVersion: 2,
									deviceListMetadata: {},
								},
								...message,
							},
						},
					};
				}
				return message;
			},
			defaultQueryTimeoutMs: undefined,
			generateHighQualityLinkPreview: true,
		});

		this.conn.ev.on('connection.update', this.handleConnectionUpdate.bind(this));
		this.conn.ev.on('creds.update', saveCreds);
		const greetingsHandler = new Greetings(this.conn);
		this.conn.ev.on('group-participants.update', (data) => greetingsHandler.handleGroupEvent(data));
		this.conn.ev.on('chats.update', async (chats) => chats.forEach(async (chat) => await saveChat(chat)));
		this.conn.ev.on('messages.upsert', this.handleMessages.bind(this));
		this.conn.ev.on('call', this.handleCalls.bind(this));
		process.on('unhandledRejection', (err) => this.handleErrors(err));
		process.on('uncaughtException', (err) => this.handleErrors(err));

		return this.conn;
	}

	async handleConnectionUpdate(s) {
		const { connection, lastDisconnect } = s;
		if (connection === 'connecting') console.log('Connecting to WhatsApp...');
		else if (connection === 'open') {
			console.log('Login Successful!');
			const { version } = require('../package.json');
			const str = `\`\`\`xstro ${version}\nprefix: ${config.PREFIX}\ncommands: ${plugins.commands.length}\nmode: ${config.MODE}\`\`\``;
			await this.conn.sendMessage(this.conn.user.id, { text: str });
		} else if (connection === 'close') {
			if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) this.connect();
			else {
				console.log('Connection closed. Device logged out.');
				await delay(10000);
				process.exit(0);
			}
		}
	}

	async handleMessages(m) {
		if (m.type !== 'notify') return;

		for (const msg of m.messages) {
			const serialized = await serialize(JSON.parse(JSON.stringify(msg)), this.conn);
			await saveMessage(msg, serialized.sender);

			if (config.AUTO_READ_MESSAGE) await this.conn.readMessages([serialized.key]);
			if (config.AUTO_STATUS_READ && serialized.from === 'status@broadcast') await this.conn.readMessages([serialized.key]);
			if (config.PRESENCE_UPDATE) {
				const presenceState = config.PRESENCE_UPDATE;
				await this.conn.sendPresenceUpdate(presenceState, serialized.from);
			}

			const isResume = new RegExp(`${config.PREFIX}( ?resume)`, 'i').test(serialized.body);
			const pausedChats = await getPausedChats();
			if (pausedChats.some((chat) => chat.chatId === serialized.from && !isResume)) continue;
			if (config.LOGS) this.logMessage(serialized);

			for (const command of commands) {
				const execute = (Instance, args) => {
					const instance = new Instance(this.conn, serialized);
					const executeFunction = () => command.function(instance, ...args, serialized, this.conn, serialized[0]);

					if (instance.ready) {
						return instance.ready.then(executeFunction);
					} else {
						return executeFunction();
					}
				};

				if (command.on) {
					const handlers = {
						message: () => serialized.body && execute(Handler, [serialized.body]),
						text: () => serialized.body && execute(Handler, [serialized.body]),
						delete: () => {
							if (serialized.type === 'protocolMessage' && serialized.message.protocolMessage.type === 'MESSAGE_DELETE') {
								const caller = new Handler(this.conn, serialized);
								caller.message = serialized.message.protocolMessage.key?.id;
								const executeDelete = () => command.function(caller, serialized, this.conn, serialized[0]);
								return caller.ready ? caller.ready.then(executeDelete) : executeDelete();
							}
						},
					};
					const result = handlers[command.on]?.();
					if (result instanceof Promise) await result;
				}
				if ((serialized.body && command.pattern) || command.alias) {
					let matched;
					if (serialized.body && command.pattern) {
						matched = serialized.body.match(command.pattern);
					}
					if (!matched && command.alias.length > 0) {
						if (serialized.body) {
							const aliasPattern = new RegExp(`^(${config.PREFIX})\\s*(${command.alias.join('|')})(?:\\s+(.*))?$`, 'i');
							matched = serialized.body.match(aliasPattern);
						}
					}

					if (matched) {
						serialized.prefix = matched[1];
						serialized.command = matched[1] + matched[2];
						const result = execute(Handler, [matched[3] || false]);
						if (result instanceof Promise) await result;
						break;
					}
				}
			}
		}
	}

	async handleCalls(call) {
		const { from, id: callId, status } = call[0];

		if (config.ANTI_CALL && status === 'offer') {
			if (config.ANTI_CALL === 'true') {
				await this.conn.rejectCall(callId, from);
				await this.conn.sendMessage(from, { text: '_Calls not allowed._' });
			} else if (config.ANTI_CALL === 'block') {
				await this.conn.rejectCall(callId, from);
				await this.conn.sendMessage(from, { text: '_Calls are not allowed, You have been blocked._' });
				return await this.conn.updateBlockStatus(from, 'block');
			}
		}
	}

	async handleErrors(err, msg = {}) {
		const { message, stack } = err;
		const fileName = stack?.split('\n')[1]?.trim();
		const errorText = `─━❲ ERROR REPORT ❳━─\nMessage: ${message}\nFrom: ${fileName}`;
		console.error('Error:', err);
		await this.conn.sendMessage(this.conn.user.id, { text: '```' + errorText + '```' });
	}

	async logMessage(msg) {
		try {
			const name = await getName(msg.sender);
			const groupName = msg.from.endsWith('@g.us') ? (await this.conn.groupMetadata(msg.from)).subject : msg.from;
			const messageType = msg.message && Object.keys(msg.message)[0];
			if (name && groupName) console.log(`At: ${groupName}\nFrom: ${name}`);

			if (messageType) {
				const text = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message[messageType]?.text;
				console.log(`Message: ${text || messageType}`);
			}
		} catch (error) {}
	}
}

module.exports = WhatsAppBot;
