import { UserData } from './User';
import ContentAPI from './ContentAPI';

export interface CommentSettings {
    // The markup type of the comment
    m?: string;
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

export class Comment {
    private static readonly API_LINK = ContentAPI.API_LINK + "Comment";
    createDate: string;
    editDate: string;
    createUserId: number;
    editUserId: number;
    deleted: boolean;
    id: number;
    parentId: number;
    content: string;
    createUser?: UserData;
    editUser?: UserData;
    settings: CommentSettings;
    textContent: string;

    // sends comment data and returns the sent comment
    public static send(data: CommentToSend, authtoken: string): Promise<Comment> {
        return fetch(Comment.API_LINK, {
                   method: "POST",
                   body: JSON.stringify(data),
                   headers: {
                       'Content-Type': 'application/json',
                       'Authorization': 'Bearer ' + authtoken
                   }
               })
               .then(response => response.json())
               .then(json => (new Comment(json.results)));
    }

    // get comment by ID
    public static getByID(id: number): Promise<Comment> {
        return fetch(`${Comment.API_LINK}Ids=${id}`)
               .then(response => response.json())
               .then(json => (new Comment(json.results[0])));
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
        this.createUser = userlist.find(user => user.id === this.createUserId);
        this.editUser = userlist.find(user => user.id === this.editUserId);
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
            this.settings = {};
            this.textContent = this.content;
        }
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
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authtoken
            }
        })
    }

    // TODO: Add delete comment functionality
    // TODO: Add 
}