import Constants from 'expo-constants';

import { observable, action, toJS } from 'mobx';
import { AxiosInstance } from 'axios';

export default class ProfileStore {
    httpClient = null;

    @observable data = null;

    constructor(httpClient: AxiosInstance) {
        this.httpClient = httpClient;
    }

    get loaded(): boolean {
        return !!this.data;
    }

    @action.bound load(): null {
        this.loading = true;
        this.httpClient
            .get(`${Constants.manifest.extra.apiUrl}/api/users/me/`)
            .then((response) => {
                this.loading = false;
                this.data = response.data.data;
                console.log('Loaded profile');
            })
            .catch((error) => {
                this.loading = false;
                this.error = error;
            });
    }

    @action.bound save(): null {
        this.loading = true;
        this.httpClient
            .patch(`${Constants.manifest.extra.apiUrl}/api/users/${this.data.id}/`, {
                data: toJS(this.data),
            })
            .then((response) => {
                this.loading = false;
                this.data = response.data.data;
            })
            .catch((error) => {
                this.loading = false;
                this.error = error;
            });
    }
}
