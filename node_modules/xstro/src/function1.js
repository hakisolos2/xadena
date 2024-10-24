const FormData = require('form-data');
let { JSDOM } = require('jsdom');
const { default: fetch } = require('node-fetch');
const axios = require('axios');

module.exports = {
 webp2mp4: async (source) => {
  let form = new FormData();
  let isUrl = typeof source === 'string' && /https?:\/\//.test(source);
  form.append('new-image-url', isUrl ? source : '');
  form.append('new-image', isUrl ? '' : source, 'image.webp');
  let res = await fetch('https://ezgif.com/webp-to-mp4', {
   method: 'POST',
   body: form,
  });
  let html = await res.text();
  let { document } = new JSDOM(html).window;
  let form2 = new FormData();
  let obj = {};
  for (let input of document.querySelectorAll('form input[name]')) {
   obj[input.name] = input.value;
   form2.append(input.name, input.value);
  }
  let res2 = await fetch('https://ezgif.com/webp-to-mp4/' + obj.file, {
   method: 'POST',
   body: form2,
  });
  let html2 = await res2.text();
  let { document: document2 } = new JSDOM(html2).window;
  return new URL(document2.querySelector('div#output > p.outfile > video > source').src, res2.url).toString();
 },
 Bitly: async (url) => {
  return new Promise((resolve, reject) => {
   const BitlyClient = require('bitly').BitlyClient;
   const bitly = new BitlyClient('6e7f70590d87253af9359ed38ef81b1e26af70fd');
   bitly
    .shorten(url)
    .then((a) => {
     resolve(a);
    })
    .catch((A) => reject(A));
   return;
  });
 },
 isNumber: function isNumber() {
  const int = parseInt(this);
  return typeof int === 'number' && !isNaN(int);
 },
 getRandom: function getRandom() {
  if (Array.isArray(this) || this instanceof String) return this[Math.floor(Math.random() * this.length)];
  return Math.floor(Math.random() * this);
 },
 postJson: async function (url, postData, options = {}) {
  try {
   const response = await axios.request({
    url: url,
    data: JSON.stringify(postData),
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
    },
    ...options,
   });
   return response.data;
  } catch (error) {
   return error;
  }
 },
 isUrl: (isUrl = (url) => {
  return new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi').test(url);
 }),
 getUrl: (getUrl = (url) => {
  return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
 }),
 qrcode: async (string) => {
  const { toBuffer } = require('qrcode');
  let buff = await toBuffer(string);
  return buff;
 },
 secondsToDHMS: (seconds) => {
  seconds = Number(seconds);

  const days = Math.floor(seconds / (3600 * 24));
  seconds %= 3600 * 24;

  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;

  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  seconds = Math.floor(seconds);

  const parts = [];

  if (days) parts.push(`${days} Days`);
  if (hours) parts.push(`${hours} Hours`);
  if (minutes) parts.push(`${minutes} Minutes`);
  if (seconds) parts.push(`${seconds} Seconds`);
  return parts.join(' ');
 },
 formatBytes: (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
 },
 clockString: (duration) => {
  (seconds = Math.floor((duration / 1000) % 60)), (minutes = Math.floor((duration / (1000 * 60)) % 60)), (hours = Math.floor((duration / (1000 * 60 * 60)) % 24));

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return hours + ':' + minutes + ':' + seconds;
 },
 parseTimeToSeconds: (timeString) => {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return minutes * 60 + seconds;
 },
 getFloor: (number) => {
  return Math.floor(number);
 },
};
