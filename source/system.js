const { command, runtime } = require('../lib');
const { spawn, exec } = require('child_process');
const path = require('path');
const os = require('os');
const { tiny } = require('xstro');

command(
 {
  pattern: 'ping',
  alias: 'speed',
  desc: 'To check ping',
  type: 'system',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  const msg = await message.reply('ᴄʜᴇᴄᴋɪɴɢ...');
  const updateInterval = 1000;

  for (let i = 0; i < 10; i++) {
   const start = new Date().getTime();
   await new Promise((resolve) => setTimeout(resolve, 20));
   const latency = new Date().getTime() - start;
   await msg.edit(`ʟᴀᴛᴇɴᴄʏ ${latency} ᴍs`);
   await new Promise((resolve) => setTimeout(resolve, updateInterval));
  }
 }
);

command(
 {
  pattern: 'restart',
  alias: 'reboot',
  desc: 'Restart System',
  type: 'system',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await message.reply('Restarting the bot...');
  const filePath = path.resolve(__dirname, '..', 'index.js');
  spawn(process.execPath, [filePath], {
   detached: true,
   stdio: 'inherit',
  });
  process.exit();
 }
);

command(
 {
  pattern: 'shutdown',
  desc: 'Shutdown System',
  type: 'system',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  await message.reply('Shutting down the bot...');
  process.exit();
 }
);

command(
 {
  pattern: 'cpu',
  desc: 'Get CPU details',
  type: 'system',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  const cpus = os.cpus();
  const coreCount = cpus.length;
  const model = cpus[0].model;
  const averageSpeed = (cpus.reduce((acc, cpu) => acc + cpu.speed, 0) / coreCount).toFixed(2);

  const coreDetails = cpus.map((cpu, index) => `Core ${index + 1}: *${cpu.speed} MHz*`).join('\n');

  const output = `*CPU Information*\n\n` + `Total Cores: *${coreCount}*\n` + `Model: *${model}*\n` + `Average Speed: *${averageSpeed} MHz*\n\n` + `*Core Speeds:*\n${coreDetails}`;

  await message.reply(tiny(output));
 }
);

command(
 {
  pattern: 'network',
  desc: 'Get network interfaces details',
  type: 'system',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  const interfaces = os.networkInterfaces();
  const interfaceDetails = Object.keys(interfaces)
   .map((iface) => {
    const addresses = interfaces[iface].map((addr) => `${addr.family} - ${addr.address} ${addr.internal ? '(internal)' : ''}`).join('\n');
    return `*${iface}*\n${addresses}`;
   })
   .join('\n\n');
  const output = `*Network Interfaces*\n\n${interfaceDetails}`;
  await message.reply(tiny(output));
 }
);

command(
 {
  pattern: 'runtime',
  desc: 'Get Runtime Of Bot',
  type: 'system',
 },
 async (message) => {
  if (!message.mode) return;
  if (message.isban) return message.reply(ban);
  const uptime = await runtime(process.uptime());
  return await message.send(tiny(`Running Since ${uptime}`));
 }
);
