import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as CONFIG from '../../config_app.json';

@Injectable({
    providedIn: 'root'
})
export class HttpServiceService {
    private backend_url;

    constructor(
        private http: HttpClient
    ) {
        this.backend_url = CONFIG.default.url;
    }

    // _______________________________________________________________________ AUTH Start

    /**
     * login and get token
     * @param email
     * @param password
     */
    auth(email: string, password: string) {
        return new Promise(resolve => {
            this.http.post(this.backend_url + '/auth', {'email': email, 'password': password}).subscribe(res => {
                resolve(res);
            }, err => {
                console.log(err);
            });
        });
    }

    // _______________________________________________________________________ AUTH End


    // _______________________________________________________________________ USER Start

    /**
     * create a new user
     * consult docs for more information about user data
     * @param data
     */
    newUser(data) {
        return new Promise(resolve => {
            this.http.post(this.backend_url + '/users', JSON.stringify(data)).subscribe(res => {
                resolve(res);
            }, err => {
                console.log(err);
            });
        });
    }

    /**
     * get a specific user
     * @param id
     */
    getUser(id) {
        return new Promise(resolve => {
            this.http.get(this.backend_url + '/users/' + id).subscribe(res => {
                resolve(res);
            }, err => {
                console.log(err);
            });
        });
    }

    /**
     * update profile information
     * @param data
     */
    updateProfile(data) {
        return new Promise(resolve => {
            this.http.put(this.backend_url + '/users', JSON.stringify(data)).subscribe(res => {
                resolve(res);
            }, err => {
                console.log(err);
            });
        });
    }

    /**
     * update the email, confirm new E-Mail
     * @param newEmail
     */
    updateEmail(newEmail: string) {
        return new Promise(resolve => {
            this.http.put(this.backend_url + '/users/email', {'new': newEmail}).subscribe(res => {
                resolve(res);
            }, err => {
                console.log(err);
            });
        });
    }

    /**
     * update the user password
     * @param newPassword (hashed)
     * @param oldPassword (hashed)
     */
    updatePassword(newPassword: string, oldPassword: string) {
        return new Promise(resolve => {
            this.http.put(this.backend_url + '/users/password', {'old': oldPassword, 'new': newPassword}).subscribe(res => {
                resolve(res);
            }, err => {
                console.log(err);
            });
        });
    }

    // _______________________________________________________________________ USER End

    // _______________________________________________________________________ CHAT Start

    /**
     * create a new ChatRoom
     * @param members
     * @param chatName
     */
    newChat(members: string[], chatName: string) {
        return new Promise(resolve => {
            this.http.post(this.backend_url + '/chat', {'member': members, 'chatName': chatName}).subscribe(res => {
                resolve(res);
            }, err => {
                console.log(err);
            });
        });
    }

    /**
     * get all chats and the unread messages
     */
    getAllChats() {
        return new Promise(resolve => {
            this.http.get(this.backend_url + '/chat').subscribe(res => {
                resolve(res);
            }, err => {
                console.log(err);
            });
        });
    }

    /**
     * delete a chat, need to be confirmed
     * @param id
     */
    deleteChat(id) {
        return new Promise(resolve => {
            this.http.delete(this.backend_url + '/chat/' + id).subscribe(res => {
                resolve(res);
            }, err => {
                console.log(err);
            });
        });
    }

    /**
     * get all information about a chat and his latest messages
     * @param id
     */
    getChat(id) {
        return new Promise(resolve => {
            this.http.get(this.backend_url + '/chat/' + id).subscribe(res => {
                resolve(res);
            }, err => {
                console.log(err);
            });
        });
    }

    /**
     * get all data for a specific message
     * @param id
     */
    getMessage(id) {
        return new Promise(resolve => {
            this.http.get(this.backend_url + '/chat/message/' + id).subscribe(res => {
                resolve(res);
            }, err => {
                console.log(err);
            });
        });
    }

    /**
     * send a new message
     * consult docs for information about chat data
     * @param data
     */
    postMessage(data) {
        return new Promise(resolve => {
            this.http.post(this.backend_url + '/chat/message', JSON.stringify(data)).subscribe(res => {
                resolve(res);
            }, err => {
                console.log(err);
            });
        });
    }

    // _______________________________________________________________________ CHAT End
}
