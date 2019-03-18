//todo encrypted and decrypted passwords

// const encrypted = CryptoJS.AES.encrypt(myString, myPassword);
// const decrypted = CryptoJS.AES.decrypt(encrypted, myPassword);
// console.log(decrypted.toString(CryptoJS.enc.Utf8));

// this.nativeStorage.setItem('myitem', {property: 'value', anotherProperty: 'anotherValue'})
//     .then(
//         () => console.log('Stored item!'),
//         error => console.error('Error storing item', error)
//     );



//todo local storage setItem and getItem

// import {NativeStorage} from '@ionic-native/native-storage/ngx';
// constructor(private nativeStorage: NativeStorage){}

// this.nativeStorage.getItem('isRememberPw').then(
//     data => {
//         console.error(data);
//     },
//     error => {
//         console.error(error);
//     }
// );



//todo api calls

//import {HTTP} from '@ionic-native/http/ngx';

// this.http.get('http://ionic.io', {}, {})
//     .then(data => {
//
//         console.log(data.status);
//         console.log(data.data); // data received by server
//         console.log(data.headers);
//
//     })
//     .catch(error => {
//
//         console.log(error.status);
//         console.log(error.error); // error message as string
//         console.log(error.headers);
//
//     });
