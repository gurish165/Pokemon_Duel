import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import Result from "./pages/Result";
import background_img from "./images/background.png";
import "./App.css";

import StartScreen from './StartScreen';
import HomeScreen from './HomeScreen';
import GameScreen from './GameScreen';

const App = () => {
  const [gameState, setGameState] = useState('start');
  const [playerName, setPlayerName] = useState('');
  const [opponentName, setOpponentName] = useState('');
  const [gameCode, setGameCode] = useState('');

  const startNewGame = () => {
    setGameState('home');
  };

  const joinGame = (name, code) => {
    // TODO: validate name and code
    setPlayerName(name);
    setGameCode(code);
    setGameState('game');
  };

  const quitGame = () => {
    setGameState('home');
    setPlayerName('');
    setOpponentName('');
    setGameCode('');
  };

  return (
    <div className="main">
      <div>
        {gameState === 'start' && (
          <StartScreen startNewGame={startNewGame} />
        )}
        {gameState === 'home' && (
          <HomeScreen joinGame={joinGame} />
        )}
        {gameState === 'game' && (
          <GameScreen
            playerName={playerName}
            opponentName={opponentName}
            quitGame={quitGame}
          />
        )}
      </div>
      <img
        src={background_img}
        className="background_img"
        alt="background img"
      />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<Room />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </div>    
  );
};

export default App;
