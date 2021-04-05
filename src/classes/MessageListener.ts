import ContentAPI from "./ContentAPI";
import { Comment } from './Comment'

// sends new comments as "newComment" events
export default class MessageListener {
    private authtoken: string;
    private lastId: number = -1;
    private timeout: number = -1;
    private running: boolean = false;

    constructor(authtoken: string) {
        this.authtoken = authtoken;
    }

    private call() {
        if (this.running) {
            // make an initial request if a lastId doesn't exist
            if (this.lastId === -1) {
                Comment.getWithLimit(1)
                    .then((comment: Array<Comment>) => {
                        this.lastId = comment[0].id;
                        this.running = true;
                        this.timeout = setTimeout(this.call);
                    })
            // otherwise, let's make a call to the chainer to grab comments
            } else {

            }
        }   
    }

    runForever() {
        this.running = true;
        this.timeout = setTimeout(this.call)
    }

    endEventLoop() {
        this.running = false;
    }
}