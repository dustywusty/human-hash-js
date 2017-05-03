const R = require('ramda');

/**
 * 
 * @param {*} bytes 
 * @param {*} words 
 */

function compress(bytes, words) {
  const length = bytes.length;
  const segment_size = Math.floor(length / words);

  if (words > length) {
    throw new RangeError(`Fewer input bytes (${bytes.length}) than requested number of words (${words})`);
  }

  const [head, tail] = R.splitAt((words - 1) * segment_size, bytes);
  const segments = R.append(tail, R.splitEvery(segment_size, head));

  return R.map(segment => R.reduce((a, b) => a ^ b, 0, segment), segments);
}

module.exports = compress;