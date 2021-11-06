// funkcija za racunanje svih prostih cinioca nekog broja
export function primeFactor(n) {
  let factors = [];
  let divisor = 2;

  while (n >= 2) {
    if (n % divisor === 0) {
      if (!factors.includes(divisor)) factors.push(divisor);
      n = n / divisor;
    } else {
      divisor++;
    }
  }
  return factors;
}

// Fisher-Yates algoritam za mesanje (shuffle) clanova niza
export function shuffle(array) {
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

const utils = {
  primeFactor,
  shuffle
};

export default utils;
