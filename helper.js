Math.randomNumber = function randomNumber(start, end, natural = false) {
  const random = Math.random() * (end - start) + start;

  return natural ? Math.trunc(random) : random;
}


Array.prototype.indexOfKey = function(key, value, start = 0) {
  for (var i = start; i < this.length; i++) {
    if (this[i][key] === value) return i;
  }
};


String.prototype.insertAt = function(string, pos) {
  return this.substring(0, pos) + string + this.substring(pos);
};


Array.prototype.indexOfKey = function(key, value) {
  for (var i = 0; i < this.length; i++) {
    if (this[i][key] === value) {
      return i;
    }
  }
};
