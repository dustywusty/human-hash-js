var should = require('chai').should();
var expect = require('chai').expect;
var humanize = require('../lib/humanize');
var SAMPLE_WORDLIST = require('./sample_wordlist');

describe('humanize', function () {
  it('should work with custom wordlist', function () {
    // Arrange
    var options = {digest: [1, 2, 3, 255], wordlist: [SAMPLE_WORDLIST]};

    // Act
    result = humanize(options);

    // Assert
    expect(result).to.equal("one-two-three-twohundredandfiftyfive");
  });

  it('should work without custom wordlist', function () {
    // Arrange
    var options = {digest: [1, 2, 3, 255]};

    // Act
    result = humanize(options);

    // Assert
    expect(result).to.equal("alabama-alanine-alaska-zulu");
  });

  it('should work with custom seperator', function () {
    // Arrange
    var options = {digest: [1, 2, 3, 255], seperator: '$'};

    // Act
    result = humanize(options);

    // Assert
    expect(result).to.equal("alabama$alanine$alaska$zulu");
  });

  it('should work with one word', function () {
    // Arrange
    var options = {digest: [1], words: 1};

    // Act
    result = humanize(options);

    // Assert
    expect(result).to.equal("alabama");
  });

  it('should work with many words', function () {
    // Arrange
    var options = {digest: [1, 2, 3, 4, 5, 6, 7], words: 7};

    // Act
    result = humanize(options);

    // Assert
    expect(result).to.equal("alabama-alanine-alaska-alpha-angel-apart-april");
  });
});