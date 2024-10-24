const fs = require('fs').promises;
const axios = require('axios');
const path = require('path');
const { Buffer } = require('buffer');
const { tmpdir } = require('os');
const { fromBuffer } = require('file-type');

/**
 * Convert a buffer to a file and save it
 * @param {Buffer} buffer The buffer to convert
 * @param {String} filename The name of the file
 * @returns {String} The path to the saved file
 * @example
 * const path = await bufferToFile(buffer, 'file.txt')
 * console.log(path)
 */

async function buffToFile(buffer, filename) {
 if (!filename) filename = Date.now();
 let { ext } = await fromBuffer(buffer);
 let filePath = path.join(tmpdir(), `${filename}.${ext}`);
 await fs.promises.writeFile(filePath, buffer);
 return filePath;
}

/**
 * Downloads content from a specified URL and returns it as a buffer.
 * @param {String} url - The URL of the resource to download.
 * @param {Object} [options={}] - Optional request configuration.
 * @returns {Promise<Buffer>} - A promise that resolves to a Buffer of the downloaded data.
 * @throws {Error} - Throws an error if the request fails.
 */
async function getBuffer(url, options = {}) {
 try {
  const res = await axios({
   method: 'get',
   url,
   headers: {
    DNT: 1,
    'Upgrade-Insecure-Request': 1,
   },
   ...options,
   responseType: 'arraybuffer',
  });
  return res.data;
 } catch (error) {
  throw new Error(`Error: ${error.message}`);
 }
}

/**
 * Reads a file and returns its content as a buffer.
 * @param {String} filePath - The path to the file.
 * @returns {Promise<Buffer>} - A promise that resolves to the file buffer.
 * @throws {Error} - Throws an error if the file cannot be read.
 */
async function localBuffer(filePath) {
 try {
  const resolvedPath = path.resolve(filePath); // Resolves the path to an absolute path
  const buffer = await fs.readFile(resolvedPath); // Reads the file into a buffer
  return buffer;
 } catch (error) {
  throw new Error(`Error reading file at ${filePath}: ${error.message}`);
 }
}

module.exports = {
 buffToFile,
 getBuffer,
 localBuffer,
};
