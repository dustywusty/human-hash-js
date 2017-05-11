var should = require('chai').should();
var expect = require('chai').expect;
var compress = require('../lib/compress');

describe('compress', function () {
  it('should throw range error if provided too few bytes', function () {
    // Arrange
    var bytes = [1, 2, 3, 4, 5];
    var words = 6;

    // Act
    var badCompress = function () {
      compress(bytes, words);
    }

    // Assert
    expect(badCompress).to.Throw(RangeError);
  });

  it('should work when length is equal to words', function () {
    // Arrange
    var bytes = [1, 2, 3, 4, 5];
    var words = 5;

    // Act
    var result = compress(bytes, words);

    // Assert
      expect(result).to.deep.equal([1, 2, 3, 4, 5]);
  });

  it('should work when length is multiple of words', function () {
    // Arrange
    var bytes = [1, 2, 2, 1, 2, 2];
    var words = 3;

    // Act
    var result = compress(bytes, words);

    // Assert
      expect(result).to.deep.equal([3, 3, 0]);
 });

  it('should work when length is not a multiple of words', function () {
    // Arrange
    var bytes = [1, 3, 2, 4, 2, 2, 3];
    var words = 3;

    // Act
    var result = compress(bytes, words);

    // Assert
      expect(result).to.deep.equal([2, 6, 3]);
  });
});
