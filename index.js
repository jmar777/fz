var isFuzzyStringMatch = require('./lib/is-fuzzy-string-match');

var USE_REGEX_THRESHOLD = 3,
    prevQuery = '',
    queryRepeatCount = 0,
    reQuery;

module.exports = function fz(candidate, query) {
  if (candidate === query) return true;

  if (query === prevQuery && query.length) {
    if (++queryRepeatCount >= USE_REGEX_THRESHOLD) {
      if (queryRepeatCount === USE_REGEX_THRESHOLD) {
        reQuery = new RegExp(query.split('').join('.*'), 'i');
      }
      return reQuery.test(candidate);
    }
  } else {
    prevQuery = query;
    queryRepeatCount = 0;
  }

  return isFuzzyStringMatch(candidate, query);
};
