// yanked and modified from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

var reSpecialOrNot = /([.*+?^${}()|[\]\\])|(.)/g;

module.exports = function buildFuzzyRegExpString(string) {
  return string.replace(reSpecialOrNot, function(match, special, not) {
    // escape special strings only, and then allow optional characters
    // in between
    return (special ? '\\' + special : not) + '.*';
  });
};
