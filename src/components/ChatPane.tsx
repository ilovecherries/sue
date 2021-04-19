import React, { useEffect, useRef, useState } from 'react';
import { Comment } from '../classes/Comment'
import '../App.css';
import MessageListener from '../classes/MessageListener'
import ContentAPI from '../classes/ContentAPI';
import { MessageBlock, MessageBlockProps } from './MessageBlock';

export interface ChatPaneProps {
    roomNumber: number;
}

export function ChatPane(props: ChatPaneProps) {
  const [chatLoaded, setChatLoaded] = useState<boolean>(false);
  // checks whether we've scrolled to the bottom on the first display
  // of the chat pane
  const firstScroll = useRef<number>(0);
  const listener: React.MutableRefObject<MessageListener | undefined> = useRef();
  const [queuedMessages, setQueuedMessages] = useState<Array<Comment>>([]);
  const [comment, setComment] = useState<Array<MessageBlockProps>>([]);
  const pane = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);


  // clear the queued messages into the webpage
  useEffect(() => {
    if (queuedMessages.length > 0) {
      const newBlock = () => {return {comments: [], user: queuedMessages[0].createUser};};
      let current = comment.pop() || newBlock(); 
      queuedMessages.forEach((c: Comment) => {
        if (c.createUserId === current.user.id)
          current.comments.push(c)
        else {
          comment.push(current);
          current = newBlock();
          current.comments.push(c);
          current.user = c.createUser
        }
      })
      comment.push(current);
      console.log(queuedMessages, comment);
      setQueuedMessages([])
      setComment(comment)
      firstScroll.current = Math.min(firstScroll.current + 1, 2);
    }

    if (bottom.current) {
      if (firstScroll.current === 1)
        bottom.current.scrollIntoView();
      else {
        bottom.current.scrollIntoView({behavior: 'smooth'});
      }
    }
  }, [comment, queuedMessages])

  // load a comment from the server
  useEffect(() => {
    const messageCallback = (c: Array<Comment>) => {
      // make sure that the comment belongs to the current room
      c = c.filter((x: Comment) => x.parentId === props.roomNumber)
      setQueuedMessages(c)
    };
    if (!chatLoaded) {
      setChatLoaded(true);
      listener.current = new MessageListener(ContentAPI.TEST_AUTHTOKEN);
      Comment.getWithLimit(20, props.roomNumber)
        .then((x: Array<Comment>) => {
          setQueuedMessages(x);
          listener.current?.addCallback('chatpane-384', messageCallback);
        });
      return function cleanup() {
        listener.current?.endEventLoop();
      }
    }
  }, [props.roomNumber, chatLoaded]);

  return (
    <div ref={pane} className="chat-pane">
      {comment.map((messageBlock: MessageBlockProps, index: number) => 
        <MessageBlock 
          key={props.roomNumber + '-' + index}
          comments={messageBlock.comments}
          user={messageBlock.user} />
      )}
      <div ref={bottom}></div>
    </div>
  );
}