'use strict';
const assert = require('assert');
const compress = require('../lib/compress');

describe('compress', function () {
  it('matches the SHA-256 abc test vector', function () {
    assert.strictEqual(Buffer.from(compress([97, 98, 99], 32)).toString('hex'),
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    assert.deepStrictEqual(compress([97, 98, 99], 4), [186, 120, 22, 191]);
  });
  it('rejects invalid output lengths', function () {
    [0, -1, 1.5, NaN, Infinity, '4', undefined, 33].forEach(words => {
      assert.throws(() => compress([1], words), RangeError);
    });
  });
  it('does not preserve the old XOR cancellation', function () {
    assert.notDeepStrictEqual(compress([1, 2, 3, 4], 1), compress([0, 3, 3, 4], 1));
  });
});
