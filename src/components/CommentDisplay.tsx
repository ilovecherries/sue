import React from 'react';
import { Comment } from '../classes/Comment';

interface CommentDisplayProps {
    comment: Comment;
}

function CommentDisplay(props: CommentDisplayProps) {
    console.log(props);
    return (
        <div>
            ${props.comment.content}
        </div>
    ) 
}

export default CommentDisplay;