const test = require('tape');
const fz = require('../');
const buildFuzzyRegExpString = require('../lib/build-fuzzy-regexp-string');

const USE_REGEX_THRESHOLD = 2;

test('Matching strings should pass', t => {
  t.equal(fz('foo', 'foo'), true);
  t.equal(getCompiledResult('foo', 'foo'), true);
  t.end();
});

test('Matching strings other than casing should pass', t => {
  t.equal(fz('foo', 'FoO'), true);
  t.equal(getCompiledResult('foo', 'FoO'), true);
  t.equal(fz('fOo', 'foo'), true);
  t.equal(getCompiledResult('fOo', 'foo'), true);
  t.end();
});

test('Partial matches should pass', t => {
  t.equal(fz('foo', 'f'), true);
  t.equal(getCompiledResult('foo', 'f'), true);
  t.equal(fz('foo', 'F'), true);
  t.equal(getCompiledResult('foo', 'F'), true);
  t.equal(fz('foo bar baz', 'oz'), true);
  t.equal(getCompiledResult('foo bar baz', 'oz'), true);
  t.end();
});

test('Blank strings (unless both are blank) should fail', t => {
  t.equal(fz('', ''), true);
  t.equal(getCompiledResult('', ''), true);
  t.equal(fz('foo', ''), false);
  t.equal(getCompiledResult('foo', ''), false);
  t.equal(fz('', 'foo'), false);
  t.equal(getCompiledResult('', 'foo'), false);
  t.end();
});

test('Non-matching strings should fail', t => {
  t.equal(fz('foo', 'g'), false);
  t.equal(getCompiledResult('foo', 'g'), false);
  t.equal(fz('foo', 'of'), false);
  t.equal(getCompiledResult('foo', 'of'), false);
  t.end();
});

test('Special characters should be escaped in RegExp creation', t => {
  t.equal(
    buildFuzzyRegExpString('.*+?^${}()|[]\\\\\\'),
    '\\..*\\*.*\\+.*\\?.*\\^.*\\$.*\\{.*\\}.*\\(.*\\).*\\|.*' +
      '\\[.*\\].*\\\\.*\\\\.*\\\\.*'
  );
  t.doesNotThrow(() => {
    getCompiledResult('blah', '.*+?^${}()|[]\\');
  });
  t.end();
});

test('Special characters should match as expected', t => {
  // regex special characters
  '.*+?^${}()|[]\\'.split('').forEach(char => {
    t.equal(fz(`a${char}b`, `${char}b`), true);
    t.equal(getCompiledResult(`a${char}b`, `${char}b`), true);
    t.equal(fz(`a${char}b`, 'ac'), false);
    t.equal(getCompiledResult(`a${char}b`, 'ac'), false);
  });
  t.end();
});

test('Chinese characters', t => {
  t.equal(fz('学而不思则罔', '而则'), true);
  t.equal(getCompiledResult('学而不思则罔', '而则'), true);
  t.equal(fz('思而不学则殆', '殆思'), false);
  t.equal(getCompiledResult('思而不学则殆', '殆思'), false);
  t.end();
});

test('Multiline handling', t => {
  t.equal(fz(`
    a
    b
  `, 'ab'), true);
  t.equal(getCompiledResult(`
    a
    b
  `, 'ab'), true);
  t.end();
});

function getCompiledResult(candidate, query) {
  let ret;

  // call it enough times with the same query to force
  // the RegExp optimization to kick in
  for (var i = 0; i < USE_REGEX_THRESHOLD + 1; i++) {
    ret = fz(candidate, query);
  }

  return ret;
}
