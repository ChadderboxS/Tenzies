import { useState, useRef } from "react";
import "./App.css";
import Dice from "./components/Dice";
import Confetti from "react-confetti";

function App() {
  const refRollButton = useRef(null);
  const [rollCount, setRollCount] = useState(1);
  const [dice, setDice] = useState(() => generateAllNewDice());

  // evalueate if the game is won
  const tenzies =
    dice.every((die) => die.isHeld) &&
    dice.every((die) => die.value === dice[0].value);

  // generate a randome die number
  function generateRandomDice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  // generate a new set of dice
  // and reset the roll count to 1 if the game is won
  function generateAllNewDice() {
    let idCount = 0;
    const newDice = Array(10)
      .fill()
      .map(() => ({
        isHeld: false,
        value: generateRandomDice(),
        id: idCount++,
      }));
    rollCount > 1 && tenzies ? setRollCount(1) : null;
    return newDice;
  }

  // update the dice values that are not held
  // and increment the roll count
  function rollDice() {
    setDice((oldDice) =>
      oldDice.map((die) =>
        die.isHeld ? die : { ...die, value: generateRandomDice() }
      )
    );
    setRollCount((prev) => prev + 1);
  }

  // hold the dice that are clicked
  function holdDice(index) {
    setDice((prevDice) =>
      prevDice.map((die) =>
        die.id === index ? { ...die, isHeld: !die.isHeld } : die
      )
    );
    // focus the roll button when a die is held
    refRollButton.current.focus();
  }

  // create dice elements to be rendered
  const diceElements = dice.map((die) => (
    <Dice
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
      id={die.id}
    />
  ));

  return (
    <main>
      {/* Show confetti when the game is won */}
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <p className="roll-count">
        {tenzies
          ? `You won in ${rollCount} Rolls!`
          : `Roll Count: ${rollCount}`}
      </p>
      <button
        className="roll-dice"
        ref={refRollButton}
        onClick={() => (tenzies ? setDice(generateAllNewDice()) : rollDice())}
      >
        {tenzies ? "New Game" : "Roll Dice"}
      </button>
    </main>
  );
}

export default App;
