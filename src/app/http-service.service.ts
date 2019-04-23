import {Injectable} from '@angular/core';
import * as CONFIG from '../config_app.json';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';


@Injectable({providedIn: 'root'})
export class HttpServiceService {
    private backend_url;

    constructor(
        private httpClient: HttpClient,
        private storage: Storage,
    ) {
        this.backend_url = CONFIG.default.url;
    }

    /**
     * method to test a connection to server with token
     * @param token
     */
    test_connection(token) {
        const data = {
            token: token
        };
        return new Promise(resolve => {
            this.httpClient
                .post(this.backend_url, data)
                .subscribe(res => {
                    // @ts-ignore
                    if (res.status === 200) {
                        console.log('Logged In');
                        resolve(true);
                    }
                }, err => {
                    // todo handle error
                    console.log(err);
                    resolve(false);
                });
        });
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
            this.httpClient
                .post(this.backend_url + '/api' + '/auth', {'email': email, 'password': password})
                .subscribe(res => {
                    // @ts-ignore
                    if (res.status === 200) {
                        console.log('Logged In');
                        // @ts-ignore
                        this.storage.set('token', res.token);
                        if (savePw === true) {
                            this.storage.set('pw', password);
                            this.storage.set('email', email);
                            console.log('E-Mail and Password saved to storage');
                        }
                    }
                    resolve(true);
                }, err => {
                    // todo handle error
                    console.log(err);
                    resolve(false);
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
            this.httpClient.post(this.backend_url + '/api' + '/users', JSON.stringify(data)).subscribe(res => {
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
            this.httpClient.get(this.backend_url + '/api' + '/users/' + id).subscribe(res => {
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
            this.httpClient.put(this.backend_url + '/api' + '/users', JSON.stringify(data)).subscribe(res => {
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
            this.httpClient.put(this.backend_url + '/api' + '/users/email', {'new': newEmail}).subscribe(res => {
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
            this.httpClient.put(this.backend_url + '/api' + '/users/password', {'old': oldPassword, 'new': newPassword}).subscribe(res => {
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
            this.httpClient.post(this.backend_url + '/api' + '/chat', {'member': members, 'chatName': chatName}).subscribe(res => {
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
            this.httpClient.get(this.backend_url + '/api' + '/chat').subscribe(res => {
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
            this.httpClient.delete(this.backend_url + '/api' + '/chat/' + id).subscribe(res => {
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
            this.httpClient.get(this.backend_url + '/api' + '/chat/' + id).subscribe(res => {
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
            this.httpClient.get(this.backend_url + '/api' + '/chat/message/' + id).subscribe(res => {
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
            this.httpClient.post(this.backend_url + '/api' + '/chat/message', JSON.stringify(data)).subscribe(res => {
                resolve(res);
            }, err => {
                console.log(err);
            });
        });
    }

    // _______________________________________________________________________ CHAT End
}
