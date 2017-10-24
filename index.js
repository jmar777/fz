var isFuzzyStringMatch = require('./lib/is-fuzzy-string-match');
var buildFuzzyRegExpString = require('./lib/build-fuzzy-regexp-string');

// note: this is the repetition count, so a threshld of `n` will
// engage on the `n + 1` successive call with the same query
var USE_REGEX_THRESHOLD = 2;

var prevQuery = '',
    queryRepeatCount = 0,
    reQuery;

module.exports = function fz(candidate, query) {
  if (candidate === query) return true;
  if (!query.length) return true;

  if (query === prevQuery) {
    if (++queryRepeatCount >= USE_REGEX_THRESHOLD) {
      if (queryRepeatCount === USE_REGEX_THRESHOLD) {
        var fuzzyRegExpString = buildFuzzyRegExpString(query);
        reQuery = new RegExp(fuzzyRegExpString, 'i');
      }
      return reQuery.test(candidate);
    }
  } else {
    prevQuery = query;
    queryRepeatCount = 0;
  }

  return isFuzzyStringMatch(candidate, query);
};
