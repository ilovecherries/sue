import React from 'react';
import logo from './logo.svg';
import CommentDisplay from './components/CommentDisplay'
import './App.css';

function App() {
  let myComment = await Comment.getByID(239501);

  return (
    <div className="App">
      <CommentDisplay comment=
    </div>
  );
}

export default App;
