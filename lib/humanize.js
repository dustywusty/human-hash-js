'use strict';
const compress = require('./compress.js');  

const DEFAULT_WORDLIST = [
  'ack', 'alabama', 'alanine', 'alaska', 'alpha', 'angel', 'apart', 'april',
  'arizona', 'arkansas', 'artist', 'asparagus', 'aspen', 'august', 'autumn',
  'avocado', 'bacon', 'bakerloo', 'batman', 'beer', 'berlin', 'beryllium',
  'black', 'blossom', 'blue', 'bluebird', 'bravo', 'bulldog', 'burger',
  'butter', 'california', 'carbon', 'cardinal', 'carolina', 'carpet', 'cat',
  'ceiling', 'charlie', 'chicken', 'coffee', 'cola', 'cold', 'colorado',
  'comet', 'connecticut', 'crazy', 'cup', 'dakota', 'december', 'delaware',
  'delta', 'diet', 'don', 'double', 'early', 'earth', 'east', 'echo',
  'edward', 'eight', 'eighteen', 'eleven', 'emma', 'enemy', 'equal',
  'failed', 'fanta', 'fifteen', 'fillet', 'finch', 'fish', 'five', 'fix',
  'floor', 'florida', 'football', 'four', 'fourteen', 'foxtrot', 'freddie',
  'friend', 'fruit', 'gee', 'georgia', 'glucose', 'golf', 'green', 'grey',
  'hamper', 'happy', 'harry', 'hawaii', 'helium', 'high', 'hot', 'hotel',
  'hydrogen', 'idaho', 'illinois', 'india', 'indigo', 'ink', 'iowa',
  'island', 'item', 'jersey', 'jig', 'johnny', 'juliet', 'july', 'jupiter',
  'kansas', 'kentucky', 'kilo', 'king', 'kitten', 'lactose', 'lake', 'lamp',
  'lemon', 'leopard', 'lima', 'lion', 'lithium', 'london', 'louisiana',
  'low', 'magazine', 'magnesium', 'maine', 'mango', 'march', 'mars',
  'maryland', 'massachusetts', 'may', 'mexico', 'michigan', 'mike',
  'minnesota', 'mirror', 'mississippi', 'missouri', 'mobile', 'mockingbird',
  'monkey', 'montana', 'moon', 'mountain', 'muppet', 'music', 'nebraska',
  'neptune', 'network', 'nevada', 'nine', 'nineteen', 'nitrogen', 'north',
  'november', 'nuts', 'october', 'ohio', 'oklahoma', 'one', 'orange',
  'oranges', 'oregon', 'oscar', 'oven', 'oxygen', 'papa', 'paris', 'pasta',
  'pennsylvania', 'pip', 'pizza', 'pluto', 'potato', 'princess', 'purple',
  'quebec', 'queen', 'quiet', 'red', 'river', 'robert', 'robin', 'romeo',
  'rugby', 'sad', 'salami', 'saturn', 'september', 'seven', 'seventeen',
  'shade', 'sierra', 'single', 'sink', 'six', 'sixteen', 'skylark', 'snake',
  'social', 'sodium', 'solar', 'south', 'spaghetti', 'speaker', 'spring',
  'stairway', 'steak', 'stream', 'summer', 'sweet', 'table', 'tango', 'ten',
  'tennessee', 'tennis', 'texas', 'thirteen', 'three', 'timing', 'triple',
  'twelve', 'twenty', 'two', 'uncle', 'undress', 'uniform', 'uranus', 'utah',
  'vegan', 'venus', 'vermont', 'victor', 'video', 'violet', 'virginia',
  'washington', 'west', 'whiskey', 'white', 'william', 'winner', 'winter',
  'wisconsin', 'wolfram', 'wyoming', 'xray', 'yankee', 'yellow', 'zebra',
  'zulu'
];

function humanize(options) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('options must be an object');
  }
  const { digest, words = 4, wordlist = [DEFAULT_WORDLIST] } = options;
  const separator = options.separator !== undefined ? options.separator :
    (options.seperator !== undefined ? options.seperator : '-');
  if (!Number.isInteger(words) || words < 1 || words > 32) {
    throw new RangeError('words must be an integer from 1 to 32');
  }
  if (typeof separator !== 'string' || separator.length === 0) {
    throw new TypeError('separator must be a nonempty string');
  }
  if (!Array.isArray(wordlist) || (wordlist.length !== 1 && wordlist.length !== words)) {
    throw new TypeError('wordlist must contain one list or one list per output word');
  }
  for (const list of wordlist) {
    if (!Array.isArray(list) || list.length < 2 || list.length > 65536 ||
        (list.length & (list.length - 1)) !== 0) {
      throw new RangeError('Each word list must contain a power of two entries, from 2 to 65536');
    }
    if (!Array.from(list).every(word => typeof word === 'string' &&
        word.length > 0 && !/\s/.test(word) && !word.includes(separator))) {
      throw new TypeError('Words must be nonempty strings without whitespace or the separator');
    }
    if (new Set(list).size !== list.length) {
      throw new TypeError('Each word list must contain unique words');
    }
  }
  const lists = Array.from({ length: words }, (_, i) => wordlist[wordlist.length === 1 ? 0 : i]);
  const widths = lists.map(list => Math.log2(list.length));
  if (widths.reduce((sum, width) => sum + width, 0) > 256) {
    throw new RangeError('The requested words require more than 256 hash bits');
  }
  const hash = compress(digest, 32);
  let offset = 0;
  return lists.map((list, i) => {
    let index = 0;
    for (let bit = 0; bit < widths[i]; bit++, offset++) {
      index = index * 2 + ((hash[Math.floor(offset / 8)] >>> (7 - offset % 8)) & 1);
    }
    return list[index];
  }).join(separator);
}

module.exports = humanize;
