import React from 'react';

const GameScreen = ({ playerName, opponentName, quitGame }) => {
  const handleQuitGame = () => {
    const confirmQuit = window.confirm('Are you sure you want to quit?');
    if (confirmQuit) {
      quitGame();
    }
  };

  return (
    <div>
      <h1>Game Screen</h1>
      <div>
        {playerName} vs. {opponentName}
      </div>
      <button onClick={handleQuitGame}>Quit Game</button>
    </div>
  );
};

export default GameScreen;
