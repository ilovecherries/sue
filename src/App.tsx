import React, { useEffect, useRef, useState } from 'react';
import { Comment } from './classes/Comment'
import './App.css';
import MessageListener from './classes/MessageListener'
import ContentAPI from './classes/ContentAPI';

export default function App() {
  const chatLoaded = useRef<boolean>(false);
  const listener: React.MutableRefObject<MessageListener | undefined> = useRef();
  const [comment, setComment] = useState<Array<Comment>>([]);
  const [roomNumber,] = useState<number>(384);

  // load a comment from the server
  useEffect(() => {
    // Comment.send('hello, world', {}, 384, ContentAPI.TEST_AUTHTOKEN)
    //   .then(x => setComment(x));
    // Comment.addMessageEvent(
    //   "(function(message){message.textContent=message.createUser.username + 's message'})"
    // );
    if (!chatLoaded.current) {
      chatLoaded.current = true;
      listener.current = new MessageListener(ContentAPI.TEST_AUTHTOKEN);
      Comment.getWithLimit(5, roomNumber)
        .then((x: Array<Comment>) => {
          setComment(x);
          listener.current?.addCallback('chatpane-384', (c: Comment) => {
            setComment(comment => comment.concat([c]))
          });
        });
    }
  }, [roomNumber]);

  return (
    <div>
      {comment.map((x: Comment) => 
        <div key={x.id}>
          <img 
            src={x.createUser.getAvatarLink(64)} 
            alt={`${x.createUser.username}'s avatar`}></img>
          {x.textContent}</div>)}
    </div>
  );
}