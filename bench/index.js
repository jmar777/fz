const fz = require('../'),
      isFuzzyStringMatch = require('../lib/is-fuzzy-string-match'),
      candidates = require('./words');

const queries = [
        'plnte', 'cstr', 'mts', 'cdimtm', 'hndt', 'vlpt', 'molti', 'prsent', 'vnnts', 'vvs',
        'alq', 'sed', 'acs', 'osur', 'isl', 'ulvina', 'ellentes', 'terdum', 'olo', 'pata'
      ],
      clen = candidates.length,
      qlen = queries.length;

const tests = {

  '`while` loop with static query': () => {
    let query = queries[0];
    for (let i = 0; i < clen; i++) {
      isFuzzyStringMatch(candidates[i], query);
    }
  },

  '`while` loop with dynamic query': () => {
    for (let i = 0; i < clen; i++) {
      isFuzzyStringMatch(candidates[i], queries[i % qlen]);
    }
  },

  'RegExp with static query': () => {
    let regex = new RegExp(queries[0].split('').join('.*'), 'i');
    for (let i = 0; i < clen; i++) {
      regex.test(candidates[i]);
    }
  },

  'RegExp with dynamic query': () => {
    for (let i = 0; i < clen; i++) {
      let regex = new RegExp(queries[i % qlen].split('').join('.*'), 'i');
      regex.test(candidates[i]);
    }
  },

  'fz() with static query': () => {
    let query = queries[0];
    for (let i = 0; i < clen; i++) {
      fz(candidates[i], query);
    }
  },

  'fz() with dynamic query': () => {
    for (let i = 0; i < clen; i++) {
      fz(candidates[i], queries[i % qlen]);
    }
  }

};

const RUN_COUNT = 1500;

console.log(`Beginning benchmarks. Each test will be run ${RUN_COUNT} times.\n`);

Object.keys(tests).forEach(name => {
  const test = tests[name];

  console.log(`Benchmarking test: ${name}`);

  const start = process.hrtime();

  for (var i = 0; i < RUN_COUNT; i++) {
    test();
  }

  const end = process.hrtime(start);

  const durationMs = (end[0] * 1000) + (end[1] / 1000000);

  console.log(`Completed in ${durationMs.toFixed(4)}ms (${(RUN_COUNT/(durationMs/1000)).toFixed(4)} ops/sec)\n`);
});
