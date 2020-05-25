import { observable, action, toJS } from 'mobx';
import { AxiosInstance } from 'axios';

import config from '../config';

export default class ProfileStore {
    httpClient:AxiosInstance;

    @observable loading = false;

    @observable data = {
        id: null,
        attributes: {
            email: null,
        }
    };
    @observable error = null;

    constructor(httpClient: AxiosInstance) {
        // @ts-ignore
        this.httpClient = httpClient;
    }

    get loaded(): boolean {
        return !!this.data.id;
    }

    get hasData(): boolean {
        return !!this.data.id;
    }

    @action.bound load(): void {
        this.loading = true;
        this.httpClient
            .get(`${config.apiUrl}/api/users/me/`)
            .then((response) => {
                this.loading = false;
                this.data = response.data.data;
                console.log('Loaded profile');
            })
            .catch((error) => {
                console.log("pl error", error);
                this.loading = false;
                this.error = error;
            });
    }

    @action.bound save(): void {
        this.loading = true;
        this.httpClient
            .patch(`${config.apiUrl}/api/users/${this.data.id}/`, {
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
