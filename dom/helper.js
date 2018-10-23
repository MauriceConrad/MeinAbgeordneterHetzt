String.prototype.matchAll = function(regExp, start = 0) {
  const matches = [];

  while (this.substring(start).match(regExp)) {
    const match = this.substring(start).match(regExp);
    match.index += start;
    matches.push(match);

    start = match.index + 1;
  }

  return matches;
};
