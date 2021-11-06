// Imports
import "./styles.css";
import React from "react";
import { shuffle, primeFactor } from "./utils";

// App
function App() {
  const [dimension, setDimension] = React.useState(null); // N - dimenzija tabele NxN
  const [primes, setPrimes] = React.useState([]); // K - Cinioci broja N
  const [pairSize, setPairSize] = React.useState(null); // Broj istih kartica (jedan od cinioca K)
  const [values, setValues] = React.useState([]); // Vrednosti kartica
  const [table, setTable] = React.useState([[]]); // Tablica sa vrednostima (matrica NxN dimenzije)

  const [stopwatch, setStopwatch] = React.useState(null); // Vrednost za vreme igranja
  const [isPlaying, setIsPlaying] = React.useState(false); // Boolean koji oznacava pocetak igre
  const [isStopped, setIsStopped] = React.useState(false); // Boolean koji oznacava da je igra zavrsena

  // Hook koji se poziva kada se 'dimension' promeni
  // Ovde se traze cinioci broja N
  React.useEffect(() => {
    setPrimes(primeFactor(dimension));
    setIsPlaying(false);
    setIsStopped(false);
  }, [dimension]);

  // Hook koji se poziva kada se 'primes' promeni
  // Odredjuje se broj istih kartica dalje
  React.useEffect(() => {
    setPairSize(null);
    setIsPlaying(false);
    setIsStopped(false);
  }, [primes]);

  // Hook koji se poziva kada se 'pairSize' promeni
  React.useEffect(() => {
    setIsPlaying(false);
    setIsStopped(false);
  }, [pairSize]);

  // Hook koji se poziva kada se 'values' promeni
  React.useEffect(() => {}, [values]);

  React.useEffect(() => {
    let interval = null;

    if (isPlaying && !isStopped) {
      interval = setInterval(() => {
        setStopwatch((time) => time + 10);
      }, 10);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, isStopped]);

  // Event handler - poziva se na promenu input polja za 'dimension' stanje
  function handleDimensionChange(e) {
    console.log(`Dimension: ${e.target.value}`);
    var val = e.target.value;
    validateDimension(val) ? setDimension(val) : setDimension(null);
  }

  // funkcija za validaciju vrednosti 'dimension' stanja
  function validateDimension(value) {
    const minValue = 4,
      maxValue = 16;

    return !isNaN(value) && value >= minValue && value <= maxValue
      ? true
      : false;
  }

  // Event Handler - reaguje na klik na dugme za odabir velicine parova
  function handlePairsSelect(e, prime) {
    if (pairSize !== prime) {
      console.log(`Pair size: ${prime}`);
      setPairSize(prime);
      console.log(`Total pairs: ${(dimension * dimension) / prime}`);
      generateValues(prime);
    }
  }

  // Generise vrednosti za "N^2 / K" parova
  function generateValues(prime) {
    var totalPairs = (dimension * dimension) / prime;
    console.log(`Generate values for ${totalPairs} pairs.`);
    var _values = [];
    for (var i = 0; i < totalPairs; i++) {
      for (var j = 0; j < prime; j++) {
        _values.push(i + 1);
      }
    }
    _values = shuffle(_values);
    setValues(_values);
    console.log(`Total values generated: ${_values.length}`);
    fillTable(_values);
  }

  // Puni kvadratnu tablicu vrednostima
  function fillTable(_values) {
    var _table = [];
    for (var i = 0; i < dimension; i++) {
      _table[i] = [];
      for (var j = 0; j < dimension; j++) {
        _table[i][j] = _values[i * dimension + j];
      }
    }
    setTable(_table);
  }

  function handleButtonStart() {
    setStopwatch(null);
    setIsPlaying(true);
    setIsStopped(false);
  }
  function handleButtonStop() {
    setIsPlaying(false);
    setIsStopped(true);
    generateValues(pairSize);
  }
  return (
    <div className="App">
      <div className="containerDimension">
        <h1>Card Game App</h1>
        <h2>Start the game by choosing dimension N for squared table</h2>
        <input
          id="dimensionInput"
          type="text"
          placeholder="Ex. 8"
          onChange={handleDimensionChange}
        ></input>
        {!isNaN(dimension) && dimension > 1 ? (
          <p>
            <strong>
              Table dimension - {dimension} x {dimension}
            </strong>
            <br />
            <strong>Total cards - {dimension * dimension}</strong>
          </p>
        ) : (
          <p>
            <strong>
              Dimension has to be a number between{" "}
              <span className="textAttention">4</span> and{" "}
              <span className="textAttention">16</span>
            </strong>
          </p>
        )}
      </div>
      {primes.length > 0 && (
        <div className="containerPairs">
          <p>
            <strong>Choose the size of pairs</strong>
          </p>
          {primes.map((item) => {
            return (
              <button
                key={item}
                className="light medium fun"
                onClick={() => handlePairsSelect(this, item)}
              >
                {item}
              </button>
            );
          })}
        </div>
      )}
      <div className="containerStart">
        {pairSize &&
          (!isPlaying ? (
            <button className="dark pill fun round" onClick={handleButtonStart}>
              Play
            </button>
          ) : (
            <button className="dark pill fun round" onClick={handleButtonStop}>
              Stop
            </button>
          ))}
        {(isPlaying || isStopped) && `${stopwatch / 1000} s`}
      </div>
      {isPlaying && table[0].length > 0 && (
        <div className="containerTable">
          {table.map((row, i) => (
            <span key={i} className="tableRow">
              {row.map((col, j) => (
                <span key={j} className="tableField">
                  {col}
                </span>
              ))}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
