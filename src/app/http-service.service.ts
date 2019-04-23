import {Injectable} from '@angular/core';
import * as CONFIG from '../config_app.json';
import {Storage} from '@ionic/storage';
import {HTTP} from '@ionic-native/http/ngx';

@Injectable({providedIn: 'root'})
export class HttpServiceService {
    private backend_url;
    private token;

    constructor(
        private storage: Storage,
        private httpClient: HTTP,
    ) {
        this.backend_url = CONFIG.default.url;
    }

    /**
     * can be used to test a token and to update user data
     */
    getAndSetUserData() {
        return new Promise(resolve => {
            this.storage.get('token').then(token => {
                this.token = token;
                this.httpClient.post(this.backend_url, {token: token}, {})
                    .then(res => {
                        const data: JSON = JSON.parse(res.data);

                        // @ts-ignore
                        if (res.status === 200) {
                            // @ts-ignore
                            this.setUserData(data.userNameFirst, data.userNameLast, data.role).then(() => resolve(true));
                        }
                    }, err => {
                        // todo handle error
                        console.log(err);
                        resolve(false);
                    });
            });
        });
    }

    /**
     *
     * @param name_first
     * @param name_last
     * @param role
     */
    private async setUserData(name_first: string, name_last: string, role: string) {
        await this.storage.set('first_name', name_first);
        await this.storage.set('last_name', name_last);
        await this.storage.set('role', role);
        console.log('set data: name: ' + name_first + ' ' + name_last + ' and role: ' + role);
    }

    // _______________________________________________________________________ AUTH Start

    /**
     * login and get token
     * @param email
     * @param password
     * @param savePw
     */
    async auth(email: string, password: string, savePw: boolean) {
        return new Promise(resolve => {
            this.httpClient.post(this.backend_url + '/api' + '/auth', {'email': email, 'password': password}, {})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);

                    // @ts-ignore
                    if (res.status === 200) {
                        console.log('Logged In');
                        if (savePw === true) {
                            this.storage.set('pw', password);
                            this.storage.set('email', email);
                            console.log('E-Mail and Password saved to storage');
                        }

                        // @ts-ignore
                        this.setToken(data.token).then(() => resolve(true));
                    }
                }, err => {
                    // todo handle error
                    console.log(err);
                    resolve(false);
                });
        });
    }

    private async setToken(token: string) {
        this.token = token;
        await this.storage.set('token', token);
    }

    // _______________________________________________________________________ AUTH End


    // _______________________________________________________________________ USER Start

    /**
     * create a new user
     * consult docs for more information about user data
     * @param nameFirst
     * @param nameLast
     * @param email
     * @param password
     * @param role
     */
    newUser(nameFirst: string, nameLast: string, email: string, password: string, role: string) {
        return new Promise(resolve => {
            this.httpClient.post(this.backend_url + '/api' + '/users', {}, {})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);

                    resolve(data);
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
            this.httpClient.get(this.backend_url + '/api' + '/users/' + id, {}, {})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    /**
     * todo
     * update profile information
     * @param data
     */
    updateProfile() {
        return new Promise(resolve => {
            this.httpClient.put(this.backend_url + '/api' + '/users', {}, {})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    /**
     * todo
     * update the email, confirm new E-Mail
     * @param newEmail
     */
    updateEmail(newEmail: string) {
        return new Promise(resolve => {
            this.httpClient.put(this.backend_url + '/api' + '/users/email', {'new': newEmail}, {})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    /**
     * todo
     * update the user password
     * @param newPassword (hashed)
     * @param oldPassword (hashed)
     */
    updatePassword(newPassword: string, oldPassword: string) {
        return new Promise(resolve => {
            this.httpClient.put(this.backend_url + '/api' + '/users/password', {'old': oldPassword, 'new': newPassword}, {})
                .then(res => {
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
            this.httpClient.post(this.backend_url + '/api' + '/chat', {'member': members, 'chatName': chatName}, {})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
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
            this.httpClient.get(this.backend_url + '/api' + '/chat', {}, {})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
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
            this.httpClient.delete(this.backend_url + '/api' + '/chat/' + id, {}, {})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
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
            this.httpClient.get(this.backend_url + '/api' + '/chat/' + id, {}, {})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
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
            this.httpClient.get(this.backend_url + '/api' + '/chat/message/' + id, {}, {})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    /**
     * todo
     * send a new message
     * consult docs for information about chat data
     * @param data
     */
    postMessage() {
        return new Promise(resolve => {
            this.httpClient.post(this.backend_url + '/api' + '/chat/message', {}, {})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    // _______________________________________________________________________ CHAT End
    // _______________________________________________________________________ CALENDAR START

    /**
     * todo
     */
    postEvent() {
        return new Promise(resolve => {
            this.httpClient.post(this.backend_url + '/api' + '/calendar', {}, {})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(res);
                }, err => {
                    console.log(err);
                });
        });
    }

    /**
     * todo
     */
    getEvents() {
        return new Promise(async resolve => {
            this.httpClient.get(this.backend_url + '/api' + '/calendar', {token: this.token}, {})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }


    // _______________________________________________________________________ CALENDAR End
}
