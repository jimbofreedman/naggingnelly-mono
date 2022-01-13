import { observable, action } from 'mobx';
import axios, {AxiosInstance} from 'axios';

import config from '../config'

export default class AuthStore {
    httpClient:AxiosInstance = axios.create({
        baseURL: config.apiUrl,
    });

    @observable apiToken: string = '';
    @observable isLoggedIn: boolean | null = null;

    // @computed get isLoggedIn(): boolean {
    //     return !!this.apiToken;
    // }

    constructor() {
        this.apiToken = localStorage.getItem('apiToken') || '';

        // Facebook.initializeAsync(Constants.manifest.extra.facebook.appId);
        this.checkLoggedIn();
    }

    @action.bound async checkLoggedIn(): Promise<boolean> {
        return this.httpClient
            .get(`${config.apiUrl}/api/users/me/`, {
                headers: {
                    authorization: `Token ${this.apiToken}`,
                },
            })
            .then(() => {
                console.log('Logged in');
                this.isLoggedIn = true;
                return true;
            })
            .catch(() => {
                console.log('Not logged in');
                this.logout();
                return false;
            });
    }

    @action.bound
    async loginEmailPassword(email: string, password: string): Promise<boolean> {
        return this.httpClient
            .post(`${config.apiUrl}/auth/obtain-auth-token/`, { username: email, password: password })
            .then((response) => {
                console.log('Login success');
                this.apiToken = response.data.token;
                this.isLoggedIn = true;
                localStorage.setItem('apiToken', this.apiToken);
                return true;
            })
            .catch((error) => {
                console.log('Login failure', error);
                if (!error.response) {
                    throw new Error('Could not contact login server');
                }
                switch (error.response.status) {
                    case 400:
                        throw new Error('Incorrect e-mail address or password');
                    default:
                        throw error;
                }
            });
    }
    //
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
    //                 `${config.apiUrl}/auth/convert-token`,
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
    //
    // @action.bound
    // async loginGoogle(): boolean {
    //     try {
    //         const config = {
    //             androidClientId: Constants.manifest.extra['google-oauth2'].androidClientId,
    //             iosClientId: Constants.manifest.extra['google-oauth2'].iosClientId,
    //             scopes: ['profile', 'email'],
    //         };
    //         const { type, accessToken /*user*/ } = await Google.logInAsync(config);
    //         if (type === 'success') {
    //             this.finishLoginOAuth('google-oauth2', accessToken);
    //         } else {
    //             // type === 'cancel'
    //             console.log('Google login cancelled');
    //         }
    //     } catch (error) {
    //         console.log(`Google Login Error: ${error}`);
    //     }
    // }
    //
    // @action.bound async finishLoginOAuth(backend: string, token: string): boolean {
    //     const params = {
    //         client_id: Constants.manifest.extra[backend].clientId,
    //         client_secret: Constants.manifest.extra[backend].clientSecret,
    //         grant_type: 'convert_token',
    //         backend,
    //         token,
    //     };
    //
    //     const response = await this.httpClient.post(`${config.apiUrl}/auth/convert-token`, params);
    //     this.apiToken = response.data.access_token;
    //     SecureStore.setItemAsync('apiToken', this.apiToken);
    //     return true;
    // }

    @action.bound logout(): void {
        localStorage.removeItem('apiToken');
        this.apiToken = '';
        this.isLoggedIn = false;
    }
}
