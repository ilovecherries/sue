import ContentAPI from "./ContentAPI";
import { Comment, CommentData } from './Comment'

interface ListenerSettings {
    lastId: number;
    chains: Array<string>;
}

interface ListenerResponse {
    chains: any;
    lastId: number;
}

// sends new comments as "newComment" events
export default class MessageListener {
    private authtoken: string;
    private lastId: number = -1;
    private running: boolean = false;
    private callbacks: Array<Function> = [];

    constructor(authtoken: string) {
        this.authtoken = authtoken;
        this.runForever();
    }

    private call() {
        if (this.running) {
            // let's make a call to the chainer to grab comments
            let settings: ListenerSettings = {
                lastId: this.lastId,
                chains: ['comment.0id', 'user.1createUserId',
                            'content.1parentId']
            };
            let url = `${ContentAPI.API_LINK}Read/listen?actions=` +
                        JSON.stringify(settings);
            fetch(url, {
                headers: {
                    'Authorization': 'Bearer ' + this.authtoken
                }
            })
                .then(response => response.json())
                .then((response: ListenerResponse) => {
                    this.lastId = response.lastId;
                    const comments: Array<Comment> = response.chains.comment.map((c: CommentData) => 
                        new Comment(c, response.chains.user)
                    );
                    this.callbacks.forEach((callback: Function) => {
                        comments.forEach((comment: Comment) => {callback(comment)})
                    });
                    this.call();
                })
                .catch((error: Error) => {console.error(error)})
        }   
    }

    runForever() {
        this.running = true;
        Comment.getWithLimit(1)
            .then((comment: Array<Comment>) => {
                this.lastId = comment[0].id;
                this.running = true;
                this.call();
            })
    }

    endEventLoop() {
        this.running = false;
    }

    addCallback(id: string, callback: Function) {
        this.callbacks.push(callback);
    }
}