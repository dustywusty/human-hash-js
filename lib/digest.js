'use strict';

module.exports = function parseDigest(digest) {
  if (typeof digest === 'string') {
    const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
    const hex = uuid.test(digest) ? digest.replace(/-/g, '') : digest;
    if (!/^(?:[0-9a-f]{2})+$/i.test(hex)) {
      throw new TypeError(
        'digest must be nonempty, even-length hex or a hyphenated UUID',
      );
    }
    return Buffer.from(hex, 'hex');
  }
  if (Buffer.isBuffer(digest) || digest instanceof Uint8Array) {
    if (digest.length === 0) throw new TypeError('digest must not be empty');
    return Buffer.from(digest);
  }
  if (
    Array.isArray(digest) &&
    digest.length > 0 &&
    Array.from(digest).every(
      (byte) => Number.isInteger(byte) && byte >= 0 && byte <= 255,
    )
  ) {
    return Buffer.from(digest);
  }
  throw new TypeError(
    'digest must be hex, a UUID, a Buffer, a Uint8Array, or an array of bytes',
  );
};
