'use strict';
const assert = require('assert');
const humanize = require('..');
const uuid = 'd1db5b2a-5720-4a27-be1b-7893230850a6';
const hex = uuid.replace(/-/g, '');
const list = Array.from({ length: 256 }, (_, i) => 'word' + i);

describe('humanize', function () {
  it('maps a known SHA-256 vector to custom words', function () {
    assert.strictEqual(humanize({ digest: '616263', wordlist: [list] }),
      'word186-word120-word22-word191');
  });
  it('normalizes UUID, hex, Buffer, Uint8Array, and byte array inputs', function () {
    const bytes = Buffer.from(hex, 'hex');
    const expected = humanize({ digest: hex });
    [uuid, uuid.toUpperCase(), hex.toUpperCase(), bytes, new Uint8Array(bytes), Array.from(bytes)]
      .forEach(digest => assert.strictEqual(humanize({ digest }), expected));
  });
  it('uses bytes after the first UUID group', function () {
    assert.notStrictEqual(humanize({ digest: uuid }),
      humanize({ digest: 'd1db5b2a-0000-4000-8000-000000000000' }));
  });
  it('does not preserve known XOR collisions', function () {
    assert.notStrictEqual(humanize({ digest: '9d2278759ae24698b1345525bd53358b' }),
      humanize({ digest: '9c2378759ae24698b1345525bd53358b' }));
    assert.notStrictEqual(humanize({ digest: '00000001000010008000001122334455' }),
      humanize({ digest: '00000100000010008000001122334455' }));
  });
  it('supports separator and the legacy spelling, with separator taking precedence', function () {
    const expected = humanize({ digest: hex }).split('-').join('$');
    assert.strictEqual(humanize({ digest: hex, separator: '$' }), expected);
    assert.strictEqual(humanize({ digest: hex, seperator: '$' }), expected);
    assert.strictEqual(humanize({ digest: hex, separator: '$', seperator: '/' }), expected);
  });
  it('supports one word and the full 32-byte hash', function () {
    assert.strictEqual(humanize({ digest: hex, words: 1 }).split('-').length, 1);
    assert.strictEqual(humanize({ digest: hex, words: 32 }).split('-').length, 32);
  });
  it('uses all nine bits for 512-entry lists', function () {
    const large = Array.from({ length: 512 }, (_, i) => 'word' + i);
    assert.strictEqual(humanize({ digest: '616263', wordlist: [large] }),
      'word372-word480-word181-word504');
  });
  it('supports different lists and sizes at each position', function () {
    assert.strictEqual(humanize({ digest: '616263', words: 2,
      wordlist: [['calm', 'lucky'], ['cat', 'dog', 'fox', 'owl']] }), 'lucky-dog');
  });
  it('rejects malformed hex, misplaced hyphens, and invalid byte inputs', function () {
    ['', 'abc', 'zz', '6162garbage', hex + 'z', 'd1db5b2a--5720-4a27-be1b-7893230850a6',
      '0x1234', ' 1234', [], [256], [-1], [1.2], ['1'], new Array(2),
      Buffer.alloc(0), new Uint8Array(0), 16, null, undefined, {}].forEach(digest => {
      assert.throws(() => humanize({ digest }), TypeError);
    });
  });
  it('rejects missing options and invalid word counts', function () {
    [undefined, null, 'abc', []].forEach(options => assert.throws(() => humanize(options), TypeError));
    [0, -1, 1.5, 33, NaN, Infinity, '4'].forEach(words => {
      assert.throws(() => humanize({ digest: hex, words }), RangeError);
    });
  });
  it('rejects invalid dictionaries and ambiguous words', function () {
    [[], null, 'words', [list, list], [new Array(256)], [Array(256).fill('same')],
      [['a', '']], [['a', 'two words']], [['a', 'two-words']], [['a', 2]],
      [['a', 'b', 'c']], [null]].forEach(wordlist => {
      assert.throws(() => humanize({ digest: hex, wordlist }), Error);
    });
    ['', null, 1].forEach(separator => {
      assert.throws(() => humanize({ digest: hex, separator }), TypeError);
    });
  });
  it('rejects requests beyond the hash bit budget', function () {
    const large = Array.from({ length: 512 }, (_, i) => 'word' + i);
    assert.throws(() => humanize({ digest: hex, words: 29, wordlist: [large] }), RangeError);
  });
});
