import React from 'react';
import { Comment } from '../classes/Comment';

interface MessagePartProps {
    comment: Comment;
}

export default function MessagePart(props: MessagePartProps) {
    return (
        <div className="message-content">
            {props.comment.textContent}
        </div>
    )
}