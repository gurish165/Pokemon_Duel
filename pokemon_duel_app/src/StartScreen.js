import React from 'react';

const StartScreen = ({ startNewGame }) => {
  return (
    <div>
      <h1>Welcome to the Game!</h1>
      <button onClick={startNewGame}>Start Game</button>
    </div>
  );
};

export default StartScreen;
