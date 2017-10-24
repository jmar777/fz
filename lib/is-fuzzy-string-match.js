module.exports = function isFuzzyStringMatch(candidate, query) {
  var clen = candidate.length,
      qlen = query.length;

  // special cases
  if (!qlen || !clen) return false;
  if (qlen > clen) return false;

  var qi = 0, ci = 0;

  while (qi < qlen) {
    var qch = query[qi++];

    var charFound = false;
    while (!charFound && ci < clen) {
      charFound = isFuzzyCharMax(candidate[ci++], qch);
    }

    // stop looping through the query if we couldn't find
    // the character in the candidate string
    if (!charFound) return false;
  }

  return true;
};

function isFuzzyCharMax(char1, char2) {
  if (char1 === char2) return true;
  if (char1.toUpperCase() === char2) return true;
  if (char1 === char2.toUpperCase()) return true;
  return false;
}
