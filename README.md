# fz

> Simple, fast, fuzzy string searching.

**Quick Example:**

```js
fz('Fuzzy wuzzy', 'fzwz'); // true
```

## Motivation

A recent project I worked on required building out a fuzzy search interaction. Surveying the already available options led me to discover that the majority of existing implementations go with one of two techniques:

1. old-school `for`/`while` loops, checking character-by-character for matches
2. regular expressions that are automatically created from the input query

While benchmarking these approaches, it became clear that both of these techniques have merit, but under different circumstances. For example, given a use case where the query input remains relatively static between searches, the `RegExp` approach wins, hands down:

[todo: image]

But when the conditions change such that the query input is highly dynamic and frequently changes between searches, the `while` loop actually fares better (primarily due to the one-time overhead of `RegExp` instantiation):

[todo: image]

While not everyone requires a solution that tackles both dynamic and static search inputs, it seemed like a useful feature to bring to the table. Instead of choosing one of these techniques over the other, `fz` simply defaults to `while` loops, and if it detects that the same query is being used across successive calls, it internally optimizes to a `RegExp` approach.

While this internal optimization is a trivial one, the result is a solution that performs competitively (but not identically) with the more efficient solution for both of these use cases. For comparison, here is how `fz` stacks up for dynamic query inputs:

[todo: image]

And here it is for static query inputs:

[todo: image]

## Getting Started

### Installing `fz`

```sh
$ npm install fz --save
```

## API

### `fz(candidate, query)`

Performs a fuzzy search against `candidate`, using `query` as the search criteria.

`candidate` will be considered a match for `query` using the following criteria:

* Every character in `query` must have a match in `candidate`.
* The matching characters must appear in the same order in both.
* `candidate` *may* contain any number of non-matching characters, including in-between the matching characters.
* CASING is IgNoRed.

Please see the examples below for more clarification.

**Arguments:**

* `candidate` :  *`String`* The string value to search against.
* `query` :  *`String`* The fuzzy search criteria to use when determining whether or not `candidate` is a match.

**Returns:** `isMatch` : *`Boolean`*

`true` if `candidate` is a match for `query`, otherwise `false`.
  
**Examples:**

```javascript
const fz = require('fz');

fz('Wombat Developers Union', 'wdu') // true
fz('Hello World!', 'wh') // false
fz('foo', 'O') // true
fz('bar', 'bart') // false
fz('???', '') // false
fz('', '???') // false
fz('', '') // true
```

## Contributing

Pull requests are welcome, but I recommend filing an issue to discuss feature proposals first.

To get started:

1. Install dev dependencies:
  ```sh
  $ npm install
  ```

2. To run the test suite:
  ```sh
  $ npm test
  ```

3. To run the bench suite:
  ```sh
  $ npm run bench
  ```

----

*A special shout-out and "thank you" goes to [Diego Rodríguez Baquero](https://github.com/DiegoRBaquero) for being awesome enough to hand over the `fz` package name on npm!*
