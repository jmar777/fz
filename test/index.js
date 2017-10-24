const test = require('tape');
const fz = require('../');

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

function getCompiledResult(candidate, query) {
  let ret;

  // call it enough times with the same query to force
  // the RegExp optimization to kick in
  for (var i = 0; i < USE_REGEX_THRESHOLD + 1; i++) {
    ret = fz(candidate, query);
  }

  return ret;
}
