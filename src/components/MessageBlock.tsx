import React from 'react';
import { Comment } from '../classes/Comment'
import { User } from '../classes/User';
import MessagePart from './MessagePart';

export interface MessageBlockProps {
    comments: Array<Comment>,
    user: User
}

export const MessageBlock = (props: MessageBlockProps) => {
    return (
        <div key={props.comments[0].id} className='message'>
            <img 
                className='avatar'
                src={props.user.getAvatarLink(64)} 
                alt={`${props.user.username}'s avatar`}></img>
            <div className='message-block'>
                <b>{props.user.username}</b>
                {props.comments.map((c: Comment) =>
                    <MessagePart key={c.id} comment={c} />
                )}
            </div>
        </div>
    )
}