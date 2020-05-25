import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
// import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';

import { observable, action, computed } from 'mobx';
import axios from 'axios';

export default class AuthStore {
    httpClient = null;

    @observable loading = true;

    @observable apiToken: string = null;

    @computed get isLoggedIn(): boolean {
        return this.apiToken !== null;
    }

    constructor() {
        this.httpClient = axios.create({
            baseURL: `${Constants.manifest.extra.apiUrl}`,
        });

        // if (__DEV__) {
        //     this.httpClient.interceptors.request.use((request) => {
        //         console.log('AuthStore HTTP Request:', request);
        //         return request;
        //     });
        // }

        SecureStore.getItemAsync('apiToken').then((t) => {
            this.apiToken = t;
            this.checkLoggedIn();
        });
        // Facebook.initializeAsync(Constants.manifest.extra.facebook.appId);
    }

    @action.bound async checkLoggedIn(): boolean {
        this.loading = true;
        return this.httpClient
            .get(`${Constants.manifest.extra.apiUrl}/api/users/me/`, {
                headers: {
                    authorization: `Token ${this.apiToken}`,
                },
            })
            .then(() => {
                console.log('Logged in');
                this.loading = false;
                return true;
            })
            .catch(() => {
                console.log('Not logged in');
                this.apiToken = null;
                this.loading = false;
                return false;
            });
    }

    @action.bound
    async loginEmailPassword(email: string, password: string): boolean {
        this.loading = true;
        return this.httpClient
            .post(`${Constants.manifest.extra.apiUrl}/auth/obtain-auth-token/`, { username: email, password: password })
            .then((response) => {
                console.log('Login success');
                this.apiToken = response.data.token;
                SecureStore.setItemAsync('apiToken', this.apiToken);
                this.loading = false;
                return true;
            })
            .catch((error) => {
                console.log('Login failure', error);
                this.loading = false;
                if (!error.response) {
                    throw new Error('Could not contact login server');
                }
                switch (error.response.status) {
                    case 400:
                        throw new Error('Incorrect e-mail address or password');
                    default:
                        throw new Error('Unknown login error', error);
                }
            });
    }

    // @action.bound
    // async loginFacebook(): boolean {
    //     try {
    //         const {
    //             type,
    //             token,
    //             /*        expires,
    //             permissions,
    //             declinedPermissions, */
    //         } = await Facebook.logInWithReadPermissionsAsync({
    //             permissions: ['public_profile', 'email'],
    //         });
    //         if (type === 'success') {
    //             const params = {
    //                 client_id: Constants.manifest.extra.facebook.clientId,
    //                 client_secret: Constants.manifest.extra.facebook.clientSecret,
    //                 grant_type: 'convert_token',
    //                 backend: 'facebook',
    //                 token,
    //             };
    //
    //             const response = await this.httpClient.post(
    //                 `${Constants.manifest.extra.apiUrl}/auth/convert-token`,
    //                 params,
    //             );
    //             this.apiToken = response.data.data.access_token;
    //             SecureStore.setItemAsync('apiToken', this.apiToken);
    //         } else {
    //             // type === 'cancel'
    //         }
    //     } catch (error) {
    //         console.log(`Facebook Login Error: ${error}`);
    //     }
    // }

    @action.bound
    async loginGoogle(): Promise<boolean> {
        this.loading = true;
        try {
            const config = {
                androidClientId: Constants.manifest.extra['google-oauth2'].androidClientId,
                iosClientId: Constants.manifest.extra['google-oauth2'].iosClientId,
                scopes: ['profile', 'email'],
            };
            const { type, accessToken /*user*/ } = await Google.logInAsync(config);
            if (type === 'success') {
                return this.finishLoginOAuth('google-oauth2', accessToken);
            } else {
                // type === 'cancel'
                this.loading = false;
                console.log('Google login cancelled');
                return false;
            }
        } catch (error) {
            this.loading = false;
            console.log(`Google login Error: ${error}`);
            return false;
        }
    }

    @action.bound async finishLoginOAuth(backend: string, token: string): boolean {
        const params = {
            client_id: Constants.manifest.extra[backend].clientId,
            client_secret: Constants.manifest.extra[backend].clientSecret,
            grant_type: 'convert_token',
            backend,
            token,
        };

        const response = this.httpClient
            .post(`${Constants.manifest.extra.apiUrl}/auth/convert-token`, params)
            .then((response) => {
                this.apiToken = response.data.access_token;
                SecureStore.setItemAsync('apiToken', this.apiToken);
                this.loading = false;
                return true;
            })
            .catch((error) => {
                console.log(error);
                this.loading = false;
                throw error;
            });
    }

    @action.bound async logout(): null {
        await SecureStore.deleteItemAsync('apiToken');
        this.apiToken = null;
    }
}
