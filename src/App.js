// Imports
import "./styles.css";
import React from "react";
import { shuffle, primeFactor } from "./utils";

// App
function App() {
  const [dimension, setDimension] = React.useState(null); // N - dimenzija tabele NxN
  const [primes, setPrimes] = React.useState([]); // K - Cinioci broja N
  const [pairSize, setPairSize] = React.useState(null); // Broj istih kartica (jedan od cinioca K)

  const [cards, setCards] = React.useState([]); // Stanje svih kartica (id, value, selected, solved)
  const [selectedCards, setSelectedCards] = React.useState([]); // Id-evi selektovanih kartica
  const [solvedCardsCounter, setSolvedCardsCounter] = React.useState(0); // Brojac resenih kartica

  const [stopwatch, setStopwatch] = React.useState(null); // Vrednost za vreme igranja
  const [cardSelectsCounter, setCardSelectsCounter] = React.useState(0); // Vrednost za broj koliko puta su karte bile otkrivene
  const [isPlaying, setIsPlaying] = React.useState(false); // Boolean koji oznacava pocetak igre
  const [isStopped, setIsStopped] = React.useState(false); // Boolean koji oznacava da je igra zavrsena

  const [isBlocked, setIsBlocked] = React.useState(false); // Boolean koji ukazuje da li je mogucnost klika na karticu blokiran (cekanje na animaciju)

  // Hook koji se poziva kada se 'dimension' promeni
  // Ovde se traze cinioci broja N
  React.useEffect(() => {
    setPrimes(primeFactor(dimension));
  }, [dimension]);

  // Hook koji se poziva kada se 'primes' promeni
  // Odredjuje se broj istih kartica dalje
  React.useEffect(() => {
    setPairSize(null);
  }, [primes]);

  function startGame() {
    setStopwatch(null);
    setIsPlaying(true);
    setIsStopped(false);
    setSolvedCardsCounter(0);
    setCardSelectsCounter(0);
  }

  function stopGame() {
    setIsPlaying(false);
    setIsStopped(true);
  }

  function resetGame() {
    setIsPlaying(false);
    setIsStopped(false);
    if (pairSize != null) generateValues(pairSize);
  }

  // Hook koji se poziva kada se 'pairSize' promeni
  React.useEffect(() => {
    resetGame();
  }, [pairSize]);

  // Hook koji se poziva kada se 'isPlaying, isStopped' promene
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

  // Hook koji se poziva kada se 'selectedCards' promeni
  React.useEffect(() => {
    var matching = true;
    for (var i = 0; i < selectedCards.length - 1; i++) {
      matching =
        selectedCards[i].value === selectedCards[i + 1].value
          ? matching && true
          : matching && false;
    }
    if (matching) {
      console.log("matching");
      if (selectedCards.length === pairSize) {
        var tempArray = Object.values({ ...cards });
        for (var i = 0; i < selectedCards.length; i++) {
          tempArray[selectedCards[i].id] = updateCard(selectedCards[i]);
        }
        setCards(Object.values({ ...tempArray }));
        setSolvedCardsCounter(solvedCardsCounter + pairSize);
        setSelectedCards([]);
      }
    } else {
      if (selectedCards.length === pairSize) {
        var tempArray = Object.values({ ...cards });
        for (var i = 0; i < selectedCards.length; i++) {
          tempArray[selectedCards[i].id] = {
            ...selectedCards[i],
            selected: false
          };
        }
        //timeout
        setIsBlocked(true);
        setTimeout(() => {
          setCards(Object.values({ ...tempArray }));
          setSelectedCards([]);
          setIsBlocked(false);
        }, 750);
      }
    }
  }, [selectedCards]);

  // Hook koji se poziva kada se 'cards' promeni
  React.useEffect(() => {}, [cards]);

  // Hook koji se poziva kada se 'solvedCardsCounter, cards' promeni (resavanje kartica)
  React.useEffect(() => {
    if (solvedCardsCounter === cards.length && cards.length > 0) stopGame();
  }, [solvedCardsCounter, cards]);

  // Event handler - poziva se na promenu input polja za 'dimension' stanje
  function handleDimensionChange(e) {
    //console.log(`Dimension: ${e.target.value}`);
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
      //console.log(`Pair size: ${prime}`);
      setPairSize(prime);
      //console.log(`Total pairs: ${(dimension * dimension) / prime}`);
      generateValues(prime);
    }
  }

  // Generise vrednosti za "N^2 / K (prime)" parova
  function generateValues(prime) {
    var totalPairs = (dimension * dimension) / prime;
    var _values = [];
    for (var i = 0; i < totalPairs; i++) {
      for (var j = 0; j < prime; j++) {
        _values.push(i + 1);
      }
    }
    _values = shuffle(_values);
    fillCards(_values);
  }

  function fillCards(_values) {
    var _cards = [];
    for (var i = 0; i < dimension * dimension; i++) {
      _cards[i] = {
        id: i,
        value: _values[i],
        selected: false,
        solved: false
      };
    }
    setCards(_cards);
    setSelectedCards([]);
    setSolvedCardsCounter([]);
  }

  function handleButtonStart() {
    resetGame();
    startGame();
  }

  function handleButtonStop() {
    stopGame();
    generateValues(pairSize);
  }

  // Reveal card
  function handleCardClick(e, card) {
    // Ako kartica nije prethodno selektovana i ako nije resena
    if (
      !selectedCards.find((_card) => _card.id === card.id) &&
      !card.solved &&
      !isBlocked
    )
      updateSelectedCards(card);
  }

  function updateSelectedCards(card) {
    card = { ...card, selected: true };
    setSelectedCards(
      Object.values({ ...selectedCards, [selectedCards.length]: card })
    );
    setCards(Object.values({ ...cards, [card.id]: { ...card } }));
    setCardSelectsCounter(cardSelectsCounter + 1);
  }

  function updateCard(card) {
    card = {
      ...card,
      selected: false,
      solved: true
    };
    return card;
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
            <button
              className="dark rectangle fun round"
              onClick={handleButtonStart}
            >
              Play
            </button>
          ) : (
            <button
              className="dark rectangle fun round"
              onClick={handleButtonStop}
            >
              Stop
            </button>
          ))}
        <div className="containerScore">
          {isStopped ? (
            <p>Game Over! Your time is</p>
          ) : isPlaying ? (
            <p>Time</p>
          ) : null}
          {(isPlaying || isStopped) && (
            <span className="pill">{stopwatch / 1000} s</span>
          )}
          {isStopped || isPlaying ? <p>Reveals</p> : null}
          {(isPlaying || isStopped) && (
            <span className="pill">{cardSelectsCounter}</span>
          )}
          {isStopped || isPlaying ? <p>Pairs</p> : null}
          {(isPlaying || isStopped) && (
            <span className="pill">
              {solvedCardsCounter / pairSize}/
              {(dimension * dimension) / pairSize}
            </span>
          )}
        </div>
      </div>
      {isPlaying && cards.length > 0 && (
        <div className="containerCards">
          {cards.map((card) => (
            <span
              key={card.id}
              className={`card ${card.selected ? " selected" : ""}${
                card.solved ? " solved" : ""
              }`}
              onClick={() => handleCardClick(this, card)}
            >
              {card.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
