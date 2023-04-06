import React, { useState } from 'react';

const HomeScreen = ({ joinGame }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleJoinGame = () => {
    joinGame(name, code);
  };

  return (
    <div>
      <h1>Home Screen</h1>
      <label>
        Name:
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      <label>
        Code:
        <input type="text" value={code} onChange={handleCodeChange} />
      </label>
      <button onClick={handleJoinGame}>Join Game</button>
    </div>
  );
};

export default HomeScreen;
