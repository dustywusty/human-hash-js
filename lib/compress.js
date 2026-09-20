'use strict';

const { createHash } = require('node:crypto');
const parseDigest = require('./digest');

// Each output byte includes information from the entire input.
function compress(bytes, words) {
  if (!Number.isInteger(words) || words < 1 || words > 32) {
    throw new RangeError('words must be an integer from 1 to 32');
  }
  return Array.from(
    createHash('sha256').update(parseDigest(bytes)).digest().slice(0, words),
  );
}

module.exports = compress;
