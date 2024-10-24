const fs = require('fs').promises;
const axios = require('axios');
const path = require('path');
const cheerio = require('cheerio');
const jsQR = require('jsqr');
const jimp = require('jimp');
const FormData = require('form-data');
const { Buffer } = require('buffer');
const { default: fetch } = require('node-fetch');
const PDFDocument = require('pdfkit');

/**
 *
 * @param {Buffer} imageBuffer
 * @returns {Buffer|null} [Buffer|null
 */

const removeBg = async (imageBuffer) => {
 const formData = new FormData();
 const inputPath = await buffToFile(imageBuffer);
 formData.append('size', 'auto');
 formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));
 try {
  const response = await axios({
   method: 'post',
   url: 'https://api.remove.bg/v1.0/removebg',
   data: formData,
   responseType: 'arraybuffer',
   headers: {
    ...formData.getHeaders(),
    'X-Api-Key': process.env.RMBG,
   },
   encoding: null,
  });

  if (response.status !== 200) {
   console.error('Error:', response.status, response.statusText);
   return null;
  }

  return response.data;
 } catch (error) {
  console.error('Request failed:', error);
  return null;
 }
};

/**
 * Reads a QR code from an image buffer.
 * @param {Buffer} imageBuffer - The image buffer containing the QR code.
 * @returns {string|null} The decoded QR code data, or null if no QR code was found.
 */
async function readQr(imageBuffer) {
 try {
  const image = await jimp.read(imageBuffer);
  const { data, width, height } = image.bitmap;
  const code = jsQR(data, width, height);
  if (code) {
   return code.data;
  }
 } catch (err) {
  throw new Error(`Error reading QR code: ${err.message}`);
 }
 return null;
}

async function fancy(text) {
 try {
  const response = await axios.get('http://qaz.wtf/u/convert.cgi', {
   params: {
    text,
   },
  });
  const $ = cheerio.load(response.data);
  const hasil = [];

  $('table > tbody > tr').each(function () {
   hasil.push({
    name: $(this).find('td:nth-child(1) > h6 > a').text(),
    result: $(this).find('td:nth-child(2)').text().trim(),
   });
  });
  return hasil.map((item) => item.result).join('\n');
 } catch (error) {
  console.error('Error fetching data:', error);
  throw error;
 }
}

async function twitter(id) {
 try {
  const url = 'https://ssstwitter.com';
  const response = await axios.get(url, {
   headers: {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
   },
  });

  const $ = cheerio.load(response.data);
  const form = $('form.pure-form.pure-g.hide-after-request');
  const includeVals = form.attr('include-vals');
  const ttMatch = includeVals.match(/tt:'([^']+)'/);
  const tsMatch = includeVals.match(/ts:(\d+)/);

  if (!ttMatch || !tsMatch) throw new Error('Cannot find tt or ts values.');

  const tt = ttMatch[1];
  const ts = tsMatch[1];

  const postData = new URLSearchParams({
   tt: tt,
   ts: ts,
   source: 'form',
   id: id,
   locale: 'en',
  });

  const postResponse = await axios.post(url, postData.toString(), {
   headers: {
    'HX-Request': 'true',
    'HX-Target': 'target',
    'HX-Current-URL': 'https://ssstwitter.com/en',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
    Referer: 'https://ssstwitter.com/result_normal',
   },
  });

  const $result = cheerio.load(postResponse.data);
  const downloads = [];
  $result('.result_overlay a.download_link').each((i, element) => {
   const text = $result(element).text().trim();
   const href = $result(element).attr('href');
   if (href && href !== '#') {
    downloads.push({
     text,
     url: href,
    });
   }
  });

  if (downloads.length === 0) throw new Error('No valid download links found.');
  const firstDownloadUrl = downloads[0].url;
  const fileResponse = await axios.get(firstDownloadUrl, {
   responseType: 'arraybuffer',
  });
  const buffer = Buffer.from(fileResponse.data);

  return buffer;
 } catch (error) {
  console.error('Error:', error);
  throw error;
 }
}
async function tinyurl(url) {
 try {
  const response = await fetch(`https://tinyurl.com/api-create.php?url=${url}`);
  return await response.text();
 } catch (error) {
  console.error(error);
  return null;
 }
}

async function ssweb(url) {
 try {
  const response = await fetch(`https://image.thum.io/get/fullpage/${url}`);

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
 } catch (error) {
  console.error('Error creating screenshot:', error);
  return null;
 }
}

async function shortenurl(url) {
 const formData = new FormData();
 formData.append('u', url);

 try {
  const response = await axios.post('https://www.shorturl.at/shortener.php', formData, {
   headers: {
    ...formData.getHeaders(),
   },
  });
  const $ = cheerio.load(response.data);
  const shortUrl = $('#shortenurl').val();
  return shortUrl;
 } catch (error) {
  console.error('Error:', error.response ? error.response.data : error.message);
  return null;
 }
}

async function aptoideDl(query) {
 try {
  const response = await axios.get('http://ws75.aptoide.com/api/7/apps/search', {
   params: {
    query,
    limit: 1,
   },
  });
  const app = response.data.datalist.list[0];

  return {
   img: app.icon,
   developer: app.store.name,
   appname: app.name,
   link: app.file.path,
  };
 } catch (error) {
  console.error('Error fetching app information:', error);
  throw error;
 }
}

async function Google(query) {
 const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

 try {
  const response = await axios.get(searchUrl, {
   headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
   },
  });

  const $ = cheerio.load(response.data);
  const results = [];

  $('div.g').each((_, element) => {
   const title = $(element).find('h3').text();
   const link = $(element).find('a').attr('href');
   const description = $(element).find('div.VwiC3b').text();

   if (title && link) {
    results.push(`Title: ${title}\nLink: ${link}\nDescription: ${description}\n`);
   }
  });

  return results.join('\n');
 } catch (error) {
  throw new Error(`Failed to scrape Google: ${error.message}`);
 }
}

async function upload(input) {
 return new Promise(async (resolve, reject) => {
  const form = new FormData();
  let fileStream;

  if (Buffer.isBuffer(input)) {
   fileStream = input;
   form.append('files[]', fileStream, 'uploaded-file.jpg');
  } else if (typeof input === 'string') {
   fileStream = fs.createReadStream(input);
   form.append('files[]', fileStream);
  } else {
   return reject(new Error('Invalid input type'));
  }

  try {
   const response = await axios({
    url: 'https://uguu.se/upload.php',
    method: 'POST',
    headers: {
     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
     ...form.getHeaders(),
    },
    data: form,
   });
   resolve(response.data.files[0].url);
  } catch (error) {
   reject(error);
  }
 });
}

async function enhanceImage(imageBuffer, enhancementType) {
 const validEnhancementTypes = ['enhance', 'recolor', 'dehaze'];
 if (!validEnhancementTypes.includes(enhancementType)) {
  enhancementType = validEnhancementTypes[0];
 }

 const formData = new FormData();
 const apiUrl = `https://inferenceengine.vyro.ai/${enhancementType}`;

 formData.append('model_version', '1');
 formData.append('image', imageBuffer, {
  filename: 'enhance_image_body.jpg',
  contentType: 'image/jpeg',
 });

 try {
  const response = await fetch(apiUrl, {
   method: 'POST',
   body: formData,
   headers: formData.getHeaders(),
  });

  if (!response.ok) {
   throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const resultBuffer = await response.buffer();
  return resultBuffer;
 } catch (error) {
  throw new Error(`Error enhancing image: ${error.message}`);
 }
}

const onwhatsapp = async (phoneNumber) => {
 const userNumber = '+2348039607375';
 const apiKey = 'UAK35165589-1fa5-43e8-92aa-c3bb997985a8';
 const apiUrl = `https://api.p.2chat.io/open/whatsapp/check-number/${userNumber}/${phoneNumber}`;

 try {
  const { data } = await axios.get(apiUrl, {
   headers: {
    'X-User-API-Key': apiKey,
   },
  });
  const { on_whatsapp, number } = data;
  return `OnWhatsApp: ${on_whatsapp},\nCountry: ${number.iso_country_code},\nRegion: ${number.region},\nTimeZone: ${number.timezone.join(', ')}`;
 } catch {
  return 'Failed to check the number. Please try again later.';
 }
};

function convertToPDF(input, inputType = 'text') {
 return new Promise((resolve, reject) => {
  const chunks = [];
  const doc = new PDFDocument();

  doc.on('data', (chunk) => chunks.push(chunk));
  doc.on('end', () => {
   const pdfBuffer = Buffer.concat(chunks);
   resolve(pdfBuffer);
  });

  switch (inputType) {
   case 'text':
    doc.fontSize(12).text(input, 100, 100);
    break;
   case 'image':
    if (typeof input === 'string' || Buffer.isBuffer(input)) {
     doc.image(input, {
      fit: [250, 300],
      align: 'center',
      valign: 'center',
     });
    } else {
     reject(new Error('Invalid image input. Must be a file path or a buffer.'));
     return;
    }
    break;
   default:
    reject(new Error('Invalid input type. Use "text" or "image".'));
    return;
  }

  doc.end();
 });
}
async function convertInputsToPDF(input, inputType) {
 if (inputType === 'text') {
  if (typeof input !== 'string' && !Buffer.isBuffer(input)) {
   throw new Error('Invalid text input. Must be a string or a buffer.');
  }
  const processedTextInput = typeof input === 'string' ? input : input.toString();
  return await convertToPDF(processedTextInput, 'text');
 } else if (inputType === 'image') {
  let processedImageInput;
  if (typeof input === 'string' && fs.existsSync(input)) {
   processedImageInput = fs.readFileSync(input);
  } else if (Buffer.isBuffer(input)) {
   processedImageInput = input;
  } else {
   throw new Error('Invalid image input. Must be a valid file path or a buffer.');
  }
  return await convertToPDF(processedImageInput, 'image');
 } else {
  throw new Error('Invalid input type. Use "text" or "image".');
 }
}

module.exports = {
 removeBg,
 readQr,
 fancy,
 twitter,
 tinyurl,
 ssweb,
 shortenurl,
 aptoideDl,
 Google,
 upload,
 enhanceImage,
 onwhatsapp,
 convertInputsToPDF,
};
