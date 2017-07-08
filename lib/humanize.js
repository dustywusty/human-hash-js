const R = require('ramda');
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

const valid_word_list = (list) => R.all(R.is(String))(list) && list.length === 256;
const valid_word_lists = (lists, words) => R.all(valid_word_list)(lists) && lists.length === words;

function humanize({ digest, seperator = '-', words = 4, wordlist = [DEFAULT_WORDLIST] }) {
  
  const buffer = Buffer(digest, 'hex');
  const compressed = compress(buffer, words);

  if (wordlist.length === 1 && valid_word_list(wordlist[0])) {
    return R.map((byte) => wordlist[0][byte], compressed).join(seperator);
  } else if (wordlist.length > 1 && wordlist.length === words && valid_word_lists(wordlist, words)) {
    return R.addIndex(R.map)((byte, index) => wordlist[index][byte], compressed).join(seperator);
  } else {
    throw `Nothing is valid`;
  }
}

module.exports = humanize;