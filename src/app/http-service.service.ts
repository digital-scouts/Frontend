import {Injectable} from '@angular/core';
import * as CONFIG from '../config_app.json';
import {Storage} from '@ionic/storage';
import {HTTP} from '@ionic-native/http/ngx';
import {Pro} from '@ionic/pro';

@Injectable({providedIn: 'root'})
export class HttpServiceService {
    private backend_url;
    private token: string;

    constructor(
        private storage: Storage,
        private httpClient: HTTP,
    ) {

        this.storage.get('backend_url').then(url => {
            this.backend_url = url ? url : CONFIG.default.url;
            console.log(`http service startet with url: ${this.backend_url}`);
        });
    }

    /**
     * set name and role to storage
     * @param name_first
     * @param name_last
     * @param role
     * @param group
     */
    private async setUserData(name_first: string, name_last: string, role: string, group: string) {
        const callStack = [];
        callStack.push(this.storage.set('first_name', name_first));
        callStack.push(this.storage.set('last_name', name_last));
        callStack.push(this.storage.set('role', role));
        callStack.push(this.storage.set('group', group));
        await Promise.all(callStack);
        console.log(`set data: name:  ${name_first}  ${name_last}  role:  ${role} group: ${group}`);
    }

    /**
     * save token to storage
     * @param {string} token
     * @return {Promise<void>}
     */
    private async setToken(token: string) {
        this.token = token;
        await this.storage.set('token', token);
    }

    public testConnection(url: string): Promise<boolean> {
        console.log('Test connection to: ' + url);
        return new Promise<boolean>((resolve, reject) => {
            try {
                this.httpClient.get(url, {}, {})
                    .then(res => {
                        res.data = JSON.parse(res.data);
                        console.log(res);
                        if (res['status'] && res.data['key'] && res.data['key'] === 147261234) {
                            // key is to check if the api is a digital-scouts api
                            // todo define a api version or a more advanced check with the key
                            // hint key is a random number
                            switch (res['status']) {
                                case 200:
                                    console.log('connection success');
                                    resolve(true);
                                    break;
                                case 300:
                                // todo hier ist platz für Umleitungsinformationen oder wartungsarbeiten
                            }
                        } else {
                            console.log('connection fail: source is not a digital-scouts server');
                            resolve(false);
                        }
                    }, err => {
                        console.log('connection fail');
                        console.log(err);
                        resolve(false);
                    });
            } catch (e) {
                console.log('error in testConnection');
                console.log(e);
                resolve(false);
            }
        });

    }

    /**
     * can be used to test a token and to update user data
     */
    getAndSetUserData() {
        return new Promise(resolve => {
            try {
                console.log('getAndSetUserData');
                this.storage.get('token').then(token => {
                    if (token) {
                        this.token = token;
                        this.httpClient.post(this.backend_url, {}, {authorization: token})
                            .then(res => {
                                console.log('getAndSetUserData success');
                                const data: JSON = JSON.parse(res.data);
                                if (res.status === 200) {
                                    this.setUserData(data['userNameFirst'], data['userNameLast'], data['role'], data['group']).then(() => resolve(true));
                                }
                            }, err => {
                                console.log('getAndSetUserData fail');
                                // todo handle error
                                console.log(err);
                                resolve(false);
                            });
                    } else {
                        resolve(false);
                    }
                });
            } catch (e) {
                console.log('error in getAndSetUserData');
                console.log(e);
                this.storage.set('backend_url', null);
            }
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
                        this.setToken(data.token).then(() => resolve(true), () => resolve(false));
                    }
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
     * @param nameFirst
     * @param nameLast
     * @param email
     * @param password
     * @param role
     */
    newUser(nameFirst: string, nameLast: string, email: string, password: string, role: string) {
        return new Promise(resolve => {
            this.httpClient.post(this.backend_url + '/api' + '/users', {
                'name_first': nameFirst,
                'name_last': nameLast,
                'email': email,
                'password': password,
                'role': role
            }, {})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);

                    resolve(data);
                }, err => {
                    err.error = JSON.parse(err.error);
                    console.log(err);
                    alert(err.error.message + ': ' + err.error.detail);
                });
        });
    }

    /**
     * get a specific user
     * @param id
     */
    getUser(id) {
        return new Promise(resolve => {
            this.httpClient.get(this.backend_url + '/api' + '/users/' + id, {}, {authorization: this.token})
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
            this.httpClient.put(this.backend_url + '/api' + '/users', {}, {authorization: this.token})
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
            this.httpClient.put(this.backend_url + '/api' + '/users/email', {'new': newEmail}, {authorization: this.token})
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
            this.httpClient.put(this.backend_url + '/api' + '/users/password', {
                'old': oldPassword,
                'new': newPassword
            }, {authorization: this.token})
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
            this.httpClient.post(this.backend_url + '/api' + '/chat', {
                'member': members,
                'chatName': chatName
            }, {authorization: this.token})
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
            this.httpClient.get(this.backend_url + '/api' + '/chat', {}, {authorization: this.token})
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
            this.httpClient.delete(this.backend_url + '/api' + '/chat/' + id, {}, {authorization: this.token})
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
            this.httpClient.get(this.backend_url + '/api' + '/chat/' + id, {}, {authorization: this.token})
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
            this.httpClient.get(this.backend_url + '/api' + '/chat/message/' + id, {}, {authorization: this.token})
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
            this.httpClient.post(this.backend_url + '/api' + '/chat/message', {}, {authorization: this.token})
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
    postEvent(eventTitle: string, eventIsPublic: boolean, eventStartDate: Date, eventEndDate: Date, eventDescription: string, groups: string[]) {
        console.log(groups);
        return new Promise(resolve => {
            this.httpClient.post(this.backend_url + '/api' + '/calendar', {
                public: eventIsPublic,
                eventName: eventTitle,
                startDate: eventStartDate,
                endDate: eventEndDate,
                description: eventDescription,
                groups: JSON.stringify(groups),
            }, {authorization: this.token})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(res);
                }, err => {
                    console.log(err);
                });
        });
    }

    putEvent(id: string, eventTitle: string, eventIsPublic: boolean = false, eventStartDate: Date, eventEndDate: Date, eventDescription: string) {
        return new Promise(resolve => {
            this.httpClient.put(this.backend_url + '/api' + '/calendar', {
                id: id,
                public: eventIsPublic,
                eventName: eventTitle,
                startDate: eventStartDate,
                endDate: eventEndDate,
                description: eventDescription
            }, {authorization: this.token})
                .then(res => {
                    res.data = JSON.parse(res.data);
                    resolve(res);
                }, err => {
                    console.log(err);
                });
        });
    }

    /**
     *
     * @param {Date} filterDateStart
     * @param {Date} filterDateEnd
     * @param group
     * @param type
     * @return {Promise<JSON>}
     */
    getEvents(filterDateStart: string = null, filterDateEnd: string = null, group: string[] = null, type: string[] = null): Promise<JSON> {
        const filter = {
            'dateStart': (filterDateStart !== null) ? new Date(filterDateStart).toISOString() : 'null',
            'dateEnd': (filterDateEnd !== null) ? new Date(filterDateEnd).toISOString() : 'null',
            'complement': 'null',
            'origin': 'null',
            'group': (group !== null) ? group : 'null',
            'type': (type !== null) ? type : 'null',
        };
        console.log(filter);
        return new Promise(async resolve => {
            this.httpClient.get(this.backend_url + '/api' + '/calendar', filter, {authorization: this.token})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }


    deleteEvent(id: string): Promise<JSON> {

        return new Promise(async resolve => {
            this.httpClient.delete(this.backend_url + '/api' + '/calendar/?id=' + id, {}, {authorization: this.token})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }


    // _______________________________________________________________________ CALENDAR End
    // _______________________________________________________________________ GROUP End

    /**
     *
     */
    getGroups(): Promise<JSON> {
        return new Promise(async resolve => {
            this.httpClient.get(this.backend_url + '/api' + '/group', {}, {authorization: this.token})
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
     * @param id
     */
    getGroup(id): Promise<JSON> {
        return new Promise(async resolve => {
            this.httpClient.get(this.backend_url + '/api' + '/group/' + id, {}, {authorization: this.token})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    /**
     *
     * @param name
     * @param leader
     * @param logo
     */
    postGroup(name: string, leader: string, logo: string): Promise<JSON> {
        return new Promise(async resolve => {
            this.httpClient.post(this.backend_url + '/api' + '/group', {
                name: name,
                leader: leader,
                logo: logo
            }, {authorization: this.token})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    /**
     *
     */
    getLessons(): Promise<JSON> {
        return new Promise(async resolve => {
            this.httpClient.get(this.backend_url + '/api' + '/group/lesson', {}, {authorization: this.token})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    /**
     *
     * @param group
     * @param startDate
     * @param end
     * @param duration
     * @param frequency
     */
    postLesson(group: string, startDate: Date, end: Date, duration: number, frequency: number): Promise<JSON> {
        return new Promise(async resolve => {
            this.httpClient.post(this.backend_url + '/api' + '/group/lesson', {
                group: group,
                startDate: startDate,
                end: end,
                duration: duration,
                frequency: frequency
            }, {authorization: this.token})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    // _______________________________________________________________________ GROUP End
    // _______________________________________________________________________ MAIL Start

    sendMail(text: string, subject: string, groups: string[]): Promise<JSON> {
        console.log(groups);
        const body = {
            'groups': groups,
            'subject': subject,
            'text': text
        };
        return new Promise(async resolve => {
            this.httpClient.post(this.backend_url + '/api' + '/mail', body, {authorization: this.token})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    // _______________________________________________________________________ MAIL End
    // _______________________________________________________________________ TASK Start

    getAllTask(): Promise<JSON> {
        return new Promise(async resolve => {
            this.httpClient.get(this.backend_url + '/api' + '/task', {}, {authorization: this.token})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    createNewTask(title: string, description: string, dueDate: Date, priority: number): Promise<JSON> {
        console.log('create new');
        return new Promise(async resolve => {
            this.httpClient.post(this.backend_url + '/api/task', {
                title: title, description: description, dueDate: dueDate, priority: priority
            }, {authorization: this.token})
                .then(res => {
                    console.log(res);
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    editExistingTask(id: string, title: string, description: string, dueDate: Date, competent: string, report: string[], done: boolean): Promise<JSON> {
        return new Promise(async resolve => {
            this.httpClient.put(this.backend_url + '/api' + '/task?id=' + id, {
                title: title, description: description, dueDate: dueDate, competent: competent, report: report, done: done
            }, {authorization: this.token})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    checkTask(id: string, check: boolean): Promise<JSON> {
        return new Promise(async resolve => {
            this.httpClient.put(this.backend_url + '/api' + '/task/done?id=' + id, {check:check}, {authorization: this.token})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    addReportToTask(id: string, report: string): Promise<JSON> {
        return new Promise(async resolve => {
            this.httpClient.put(this.backend_url + '/api' + '/task/report?id=' + id, {report: report}, {authorization: this.token})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    deleteTask(id: string): Promise<JSON> {
        return new Promise(async resolve => {
            this.httpClient.delete(this.backend_url + '/api' + '/task?id=' + id, {}, {authorization: this.token})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    // _______________________________________________________________________ TASK End
    // _______________________________________________________________________ Admin Account Start

    getAllUser(): Promise<JSON> {
        return new Promise(async resolve => {
            this.httpClient.get(this.backend_url + '/api' + '/admin/accounts/user', {}, {authorization: this.token})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    /**
     *
     * @param id
     */
    deleteUser(id: string) {
        return new Promise(async resolve => {
            this.httpClient.delete(this.backend_url + '/api' + '/admin/accounts/user', {
                id: id
            }, {authorization: this.token})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    /**
     * activate user
     * @param id
     * @param namiLink
     */
    activateUser(id: string, namiLink: number = null) {
        return new Promise(async resolve => {
            this.httpClient.put(this.backend_url + '/api' + '/admin/accounts/notActivated?id=' + id + '&namiLink=' + namiLink,
                {}, {authorization: this.token})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    /**
     * enable or disable user
     * @param id
     */
    changeDisableUser(id: string) {
        return new Promise(async resolve => {
            this.httpClient.put(this.backend_url + '/api' + '/admin/accounts/disabled?id=' + id, {}, {authorization: this.token})
                .then(res => {
                    const data: JSON = JSON.parse(res.data);
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
    }

    // _______________________________________________________________________ Admin Account End
}
