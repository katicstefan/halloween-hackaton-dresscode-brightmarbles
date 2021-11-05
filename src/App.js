import "./styles.css";
import React from "react";

function App() {
  const [dimension, setDimension] = React.useState(null); // N - dimenzija tabele NxN
  const [primes, setPrimes] = React.useState([]); // K - Cinioci broja N
  const [pairs, setPairs] = React.useState(null); // Broj istih kartica (jedan od cinioca K)
  const [values, setValues] = React.useState([]); // Vrednosti kartica
  const [table, setTable] = React.useState([[]]); // Tablica sa vrednostima (matrica NxN dimenzije)

  // Hook koji se poziva kada se 'dimension' promeni
  // Ovde se traze cinioci broja N
  React.useEffect(() => {
    setPrimes(primeFactor(dimension));
  }, [dimension]);

  // Hook koji se poziva kada se 'primes' promeni
  // Odredjuje se broj istih kartica dalje
  React.useEffect(() => {
    setPairs(null);
  }, [primes]);

  // Hook koji se poziva kada se 'pairs' promeni
  React.useEffect(() => {}, [pairs]);

  // Hook koji se poziva kada se 'pairs' promeni
  React.useEffect(() => {}, [values]);

  // Event handler - poziva se na promenu input polja za 'dimension' stanje
  function handleDimensionChange(e) {
    console.log(`Dimension: ${e.target.value}`);
    var val = e.target.value;
    validateDimension(val) ? setDimension(val) : setDimension(null);
  }

  // funkcija za validaciju vrednosti 'dimension' stanja
  function validateDimension(value) {
    return !isNaN(value) && value > 1 ? true : false;
  }

  // funkcija za racunanje svih prostih cinioca nekog broja
  function primeFactor(n) {
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

  // funkcija koja kreira string od prostih cinioca
  function factorsToString() {
    var result = "";
    for (var i of primes) {
      result += `${i}, `;
    }
    return result.slice(0, result.length - 2);
  }

  // Event Handler - reaguje na klik na dugme za odabir broja parova
  function handlePairsSelect(e, item) {
    console.log(`Pair size: ${item}`);
    setPairs(item);
    console.log(`Total pairs: ${(dimension * dimension) / item}`);
    generateValues(item);
  }

  function generateValues(item) {
    var totalPairs = (dimension * dimension) / item;
    console.log(`Generate values for ${totalPairs} pairs.`);
    var _values = [];
    for (var i = 0; i < totalPairs; i++) {
      for (var j = 0; j < item; j++) {
        _values.push(i + 1);
      }
    }
    _values = shuffle(_values);
    setValues(_values);
    console.log(`Total values generated: ${_values.length}`);
    fillTable(_values);
  }

  function fillTable(_values) {
    var _table = [];
    for (var i = 0; i < dimension; i++) {
      _table[i] = [];
      for (var j = 0; j < dimension; j++) {
        _table[i][j] = _values[i * dimension + j];
      }
    }
    setTable(_table);
    //console.log(_table);
  }

  // Fisher-Yates algoritam za mesanje (shuffle) clanova niza
  function shuffle(array) {
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

  // funkcija koja vraca string sa svim vrednostima iz niza 'values'
  function valuesToString() {
    var result = "";
    for (var i of values) {
      result += `${i}, `;
    }
    return result.slice(0, result.length - 2);
  }

  return (
    <div className="App">
      <div className="containerDimension">
        <h1>Card Game App</h1>
        <h2>Start the game by entering dimension N for the table NxN</h2>
        {/* <label htmlFor="dimensionInput">
          <strong>Dimension: </strong>
        </label> */}
        <input
          id="dimensionInput"
          type="text"
          placeholder="Ex. 8"
          onChange={handleDimensionChange}
        ></input>
        {!isNaN(dimension) && dimension > 1 ? (
          <p>
            <strong>
              Table dimension: {dimension} x {dimension}
            </strong>
          </p>
        ) : (
          <p>
            <strong>Dimension has to be a number and greater than 1.</strong>
          </p>
        )}
      </div>
      {/* <div className="containerFactors">
        {dimension && (
          <div>
            <strong>Factors for N = {dimension}:</strong>
            <h1>{factorsToString()}</h1>
          </div>
        )}
      </div> */}
      {primes.length > 0 && (
        <div className="containerPairs">
          <p>
            <strong>Choose the size of pairs</strong>
          </p>
          {primes.map((item) => {
            return (
              <button
                key={item}
                className="buttonPairs"
                onClick={() => handlePairsSelect(this, item)}
              >
                {item}
              </button>
            );
          })}
        </div>
      )}
      {/* <div className="containerValues">
        {values.length > 0 && (
          <p>
            <strong>Generated values: </strong>
            <br />
            <strong className="small-text">{valuesToString()}</strong>
          </p>
        )}
      </div> */}
      {table[0].length > 0 && (
        <div className="containerTable">
          <table>
            <tbody>
              {table.map((row, i) => (
                <tr key={i} className="tableRow">
                  {row.map((col, j) => (
                    <td key={j} className="tableField">
                      {col}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
