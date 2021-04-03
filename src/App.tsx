import React, { useEffect, useState } from 'react';
import { Comment } from './classes/Comment'
import './App.css';

function App() {
  const [comment, setComment] = useState<Comment | undefined>(undefined);

  // load a comment from the server
  useEffect(() => {
    Comment.send('hello, world', {}, 6661, '')
      .then(x => setComment(x));
  }, []);

  return (
    <div>
      {comment !== undefined &&
        <span>{comment.textContent}</span>
      }
    </div>
  );
}

export default App;
