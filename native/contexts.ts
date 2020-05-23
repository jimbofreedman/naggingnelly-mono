import React from 'react';
import axios from 'axios';
import Constants from 'expo-constants';
import { ResourceStore } from '@reststate/mobx';

import AuthStore from './stores/authStore';
import ProfileStore from './stores/profileStore';

console.log('API:', Constants.manifest.extra.apiUrl);

const httpClient = axios.create({
    baseURL: `${Constants.manifest.extra.apiUrl}/api/`,
});

const authStore = new AuthStore(httpClient);

if (__DEV__) {
    httpClient.interceptors.request.use((request) => {
        console.log('HTTP Request:', request);
        return request;
    });
}

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

export default React.createContext({
    authStore,
    profileStore: new ProfileStore(httpClient),
    todoItemStore: new ResourceStore({ name: 'todo-items', httpClient }),
});
