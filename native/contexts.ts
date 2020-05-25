import React from 'react';
import axios from 'axios';
import Constants from 'expo-constants';
import { ResourceStore } from '@reststate/mobx';

import AuthStore from './stores/authStore';
import ProfileStore from './stores/profileStore';

console.log('API:', Constants.manifest.extra.apiUrl);

const authHttpClient = axios.create({
    baseURL: `${Constants.manifest.extra.apiUrl}/api/`,
});

const authStore = new AuthStore(authHttpClient);

const createHttpClient = () => {
    const httpClient = axios.create({
        baseURL: `${Constants.manifest.extra.apiUrl}/api/`,
    });
    //
    // if (__DEV__) {
    //     httpClient.interceptors.request.use((request) => {
    //         console.log('HTTP Request:', request.url, request.headers, request.data);
    //         return request;
    //     });
    // }
    httpClient.interceptors.request.use((config) => {
        const finalChar = config.url[config.url.length - 1];

        if (finalChar === '?') {
            // eslint-disable-next-line no-param-reassign
            config.url = `${config.url.slice(0, -1)}/`;
        } else if (finalChar !== '/') {
            // eslint-disable-next-line no-param-reassign
            config.url += '/';
        }

        return config;
    });

    httpClient.interceptors.request.use(
        (config) => {
            // eslint-disable-next-line no-param-reassign
            if (authStore.apiToken) {
                config.headers = {
                    ...config.headers,
                    'Content-Type': 'application/vnd.api+json',
                    Accept: 'application/vnd.api+json',
                    Authorization: `Token ${authStore.apiToken}`,
                };
            }
            return config;
        },
        (error) => Promise.reject(error),
    );
    return httpClient;
};

export default React.createContext({
    authStore,
    profileStore: new ProfileStore(createHttpClient()),
    todoItemStore: new ResourceStore({ name: 'todo-items', httpClient: createHttpClient() }),
});
