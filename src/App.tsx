import React from 'react';
import './App.css';
import { ChatPane } from './components/ChatPane';

export default function App() {

  return (
    <div className="App">
      <ChatPane roomNumber={384} />
      <ChatPane roomNumber={384} />
    </div>
  );
}