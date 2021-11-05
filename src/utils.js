// funkcija koja kreira string od prostih cinioca
export function factorsToString(primes) {
  var result = "";
  for (var i of primes) {
    result += `${i}, `;
  }
  return result.slice(0, result.length - 2);
}

// funkcija koja vraca string sa svim vrednostima iz niza 'values'
export function valuesToString(values) {
  var result = "";
  for (var i of values) {
    result += `${i}, `;
  }
  return result.slice(0, result.length - 2);
}

const utils = {
  factorsToString,
  valuesToString
};

export default utils;
