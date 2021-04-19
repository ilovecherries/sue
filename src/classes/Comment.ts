import ContentAPI from './ContentAPI';
import { Hook, HookInterface } from './Hooks';
import { User, UserData } from './User';

export interface CommentSettings {
    // The markup type of the comment
    m: string;
    // The bridge username
    b?: string;
    // The nickname attached to the comment
    n?: string;
}

export interface CommentToSend {
    parentId: number;
    content: string;
}

export interface CommentData extends CommentToSend {
    createDate: string;
    editDate: string;
    createUserId: number;
    editUserId: number;
    deleted: boolean;
    id: number;
}

export class Comment implements CommentData {
    private static readonly API_LINK = ContentAPI.API_LINK + "Comment";
    public static hooks: HookInterface<Comment> = new HookInterface<Comment>();
    createDate: string;
    editDate: string;
    createUserId: number;
    editUserId: number;
    deleted: boolean;
    id: number;
    parentId: number;
    content: string;
    createUser: User;
    editUser: User;
    settings: CommentSettings;
    textContent: string;
    DOMElement: HTMLDivElement;
    // TODO: Add DOM element for rendered message

    // sends comment data and returns the sent comment
    public static send(content: string, settings: CommentSettings, 
                       pageId: number, authtoken: string): Promise<Comment> {
        let data: CommentToSend = {
            content: `${JSON.stringify(settings)}\n${content}`,
            parentId: pageId
        }
        console.log(JSON.stringify(data))
        return fetch(Comment.API_LINK, {
                   method: "POST",
                   body: JSON.stringify(data),
                   headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${authtoken}`
                   }
               })
               .then(response => response.json())
               .then(json => (new Comment(json)));
    }

    // get comment by ID
    public static getByID(id: number): Promise<Comment> {
        return fetch(`${Comment.API_LINK}?Ids=${id}`)
               .then(response => response.json())
               .then(json => (new Comment(json[0])));
    }


    public static addMessageEvent(code: string): void {
        Comment.hooks.addPostHookEvent(new Hook<Comment>(code));
    }

    // get last sent comments in selected parentID with length LIMIT
    public static getWithLimit(limit: number, 
        parentID: undefined | number = undefined): Promise<Array<Comment>> {
        // TODO: Replace with Chainer dedicated class
        let settings: any = {
            'reverse': true,
            'limit': limit
        };
        if (parentID)
            settings.parentIds = [parentID];
        let url = `${ContentAPI.API_LINK}Read/chain/?requests=comment-${JSON.stringify(settings)}&requests=user.0createUserId&requests=user.0editUserId`;
        return fetch(url)
                .then(response => response.json())
                .then(json => {
                    console.log(json);
                    return json['comment']
                        .filter((x: CommentData) => !x.deleted)
                        .map((x: CommentData) => new Comment(x, json['user'])).reverse()
                });
    }

    constructor(commentData: CommentData, userlist: UserData[]=[]) {
        this.parentId = commentData.parentId;
        this.content = commentData.content;
        this.createDate = commentData.createDate;
        this.editDate = commentData.editDate;
        this.createUserId = commentData.createUserId;
        this.editUserId = commentData.editUserId;
        this.deleted = commentData.deleted;
        this.id = commentData.id;
        // these find if a certain user is in the userlist and we store them
        // for convenience later on
        let createUserData = userlist.find(user => user.id === this.createUserId);
        if (createUserData !== undefined) 
            this.createUser = new User(createUserData)
        else {
            throw new Error('Cannot find create user ID in the userlist. Is this a malformed chain call?');
        }
        let editUserData = userlist.find(user => user.id === this.editUserId);
        if (editUserData !== undefined) 
            this.editUser = new User(editUserData)
        else
            throw new Error('Cannot find create user ID in the userlist. Is this a malformed chain call?');
        // extract the settings from the text
        try {
            let firstNewline = this.content.indexOf('\n');
            let settings: CommentSettings = JSON.parse(
                this.content.substring(0, firstNewline)
            );
            this.settings = settings;
            this.textContent = this.content.substring(firstNewline);
        // if the json couldn't be parsed, then that probably means there are no
        // settings sent in the message
        } catch (Error) {
            console.error(Error);
            this.settings = {m: '12y'};
            this.textContent = this.content;
        }
        // run the 
        this.DOMElement = document.createElement('div');

        Comment.hooks.callHooks(this, () => {
            // this.DOMElement.append(Parse.(this.textContent, this.settings.m));
        });
    }

    toJSON() {
        return {
            createDate: this.createDate,
            editDate: this.editDate,
            createUserId: this.createUserId,
            editUserId: this.editUserId,
            deleted: this.deleted,
            id: this.id,
            parentId: this.parentId,
            content: this.content,
        }
    }

    edit(content: string, settings: CommentSettings, authtoken: string) {
        this.content = `${JSON.stringify(settings)}\n${content}`;
        fetch(`${Comment.API_LINK}/${this.id}`, {
            method: 'PUT',
            body: JSON.stringify(this),
            headers: {
                'Content-Type': 'text/json',
                'Authorization': 'Bearer ' + authtoken
            }
        })
    }

    // TODO: Add delete comment functionality
}