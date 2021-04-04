import React, { useEffect, useState } from 'react';
import { Comment } from './classes/Comment'
import './App.css';

export default function App() {
  const [comment, setComment] = useState<Array<Comment> | undefined>(undefined);

  // load a comment from the server
  useEffect(() => {
    // Comment.send('hello, world', {}, 384, ContentAPI.TEST_AUTHTOKEN)
    //   .then(x => setComment(x));
    Comment.addMessageEvent("(function(message){message.textContent='Overwriting Text Content'})")
    Comment.getWithLimit(5, 384)
      .then((x: Array<Comment>) => setComment(x));
  }, []);

  return (
    <div>
      {comment !== undefined && comment.reverse().map((x: Comment) => 
        <div key={x.id}>{x.createUserId} {x.textContent}</div>)}
    </div>
  );
}