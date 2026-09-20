# human-hash-js

**Give your IDs a name people can say out loud.**

```text
d1db5b2a-5720-4a27-be1b-7893230850a6
                   ↓
       georgia-cola-florida-july
```

Turn UUIDs, hexadecimal digests, and bytes into deterministic word sequences. Use them for game URLs, log labels, and support references.

The same bytes and options produce the same name. Short names can collide, so they do not replace database uniqueness constraints.

## Try it

Clone the repository:

```sh
git clone https://github.com/dustywusty/human-hash-js.git
cd human-hash-js
node examples/default.js
```

The library uses Node.js built-ins and has no runtime dependencies.

```js
const humanize = require('./');

const name = humanize({
  digest: 'd1db5b2a-5720-4a27-be1b-7893230850a6'
});

console.log(name); // georgia-cola-florida-july
console.log(`/g/${name}`); // /g/georgia-cola-florida-july
```

## Choose your words

One list supplies every position. A separate list for each position gives names a specific pattern.

```js
const humanize = require('./');

const name = humanize({
  digest: 'd1db5b2a-5720-4a27-be1b-7893230850a6',
  wordlist: [
    ['lucky', 'brave'],
    ['playful', 'sleepy'],
    ['calm', 'angry'],
    ['hippopotamus', 'otter']
  ]
});

console.log(name); // lucky-sleepy-calm-otter
```

This tiny example has only 16 combinations. Production lists need more entries.

Each list must contain a power of two entries, from 2 to 65,536. Lists with 256, 512, or 2,048 entries all work.
Each entry must be a unique, nonempty string within its list. Entries cannot contain whitespace or the separator.
For URLs, lowercase ASCII words work well. Other characters can require URL encoding.

List sizes can differ between positions. List order matters: changes to entries or their order can change existing names.

## API

```js
humanize({ digest, words, wordlist, separator });
```

| Option | Default | Meaning |
| --- | --- | --- |
| `digest` | Required | Hex string, hyphenated UUID, `Buffer`, `Uint8Array`, or byte array |
| `words` | `4` | Integer from 1 to 32 |
| `wordlist` | One built-in list of 256 words | An array with one list, or one list per output word |
| `separator` | `'-'` | Nonempty string between words |
| `seperator` | None | Legacy alias. `separator` takes precedence. |

Hex input must contain complete byte pairs. UUID input must use the `8-4-4-4-12` hexadecimal format.
UUID validation checks the format, not version-specific field semantics. Uppercase and lowercase hex produce the same name.
Empty input, malformed hex, invalid byte values, and invalid options produce `TypeError` or `RangeError` exceptions.

The function hashes the entire input with SHA-256. It reads hash bits from left to right to select each word.
A 256-entry list uses eight bits per word. A 512-entry list uses nine bits per word.
Power-of-two list sizes prevent modulo bias. The combined output can use at most 256 hash bits.

For example, 32 words fit with 256-entry lists. With 512-entry lists, the maximum is 28 words.
More output bits do not add randomness to a predictable input.

## How many names fit?

The capacity is the product of the list sizes at each position. These figures assume distinct words and unambiguous separators.

| Words | Entries per list | Possible names | Output bits |
| ---: | ---: | ---: | ---: |
| 4 | 256 | 4,294,967,296 | 32 |
| 4 | 512 | 68,719,476,736 | 36 |
| 4 | 2,048 | 17,592,186,044,416 | 44 |
| 5 | 256 | 1,099,511,627,776 | 40 |
| 8 | 256 | 18,446,744,073,709,551,616 | 64 |

Collisions can occur long before the name space fills. For four 256-entry lists, 10,000 names have about a 1.16% chance of at least one collision.
At 77,000 names, that probability is about 50%. These estimates assume independent, uniformly distributed outputs.

That is different from the chance that the next name collides. With one million occupied names, the next candidate needs a retry about 0.023% of the time.

## Game URLs with unique names

A stored name can serve as a readable alias for a game UUID. The database enforces uniqueness.

1. Keep the UUID as the internal game identifier.
2. Generate a candidate name.
3. Insert the name and UUID together under a unique constraint on the name.
4. If the database reports a name collision, generate a new candidate from fresh random bytes.
5. Retry the insert with a bounded retry limit.
6. Resolve incoming names through the stored mapping.

```js
const { randomBytes } = require('crypto');
const humanize = require('./');

// Generate another candidate after a database uniqueness conflict.
const candidate = humanize({ digest: randomBytes(16) });
```

The same UUID always produces the same candidate. A retry with unchanged input cannot resolve a collision.
A separate existence check before the insert cannot prevent concurrent inserts. The unique constraint must enforce the rule.

The library does not store names or retry database operations. A name identifies a game, but it does not prove seat ownership.
Private player credentials can protect claimed seats. A short name alone does not protect an open invitation from guesses.

## Compatibility

**This algorithm changes names from the original XOR implementation.**

The original parser silently truncated hyphenated UUIDs. The new parser consumes all 16 bytes and rejects malformed input.
SHA-256 replaces segment-wise XOR, including for byte arrays and plain hex input.
Dictionary validation also rejects duplicates, empty entries, whitespace, and entries that contain the separator.
The old `seperator` option still works. Empty separators no longer work.

For existing links, retain the stored names and their UUID mappings. Do not regenerate old names with the new algorithm.
If names exist without stored mappings, build those mappings with the old version before an upgrade.

## Development

Install the test dependencies:

```sh
npm install
```

Run the tests:

```sh
npm test
```

Tests cover SHA-256 vectors, UUID normalization, malformed input, former XOR collisions, custom lists, and larger dictionaries.

## License

[Unlicense](LICENSE). Free to use, modify, and share.
