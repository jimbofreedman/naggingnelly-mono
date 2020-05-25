import React from 'react';
import axios, {AxiosInstance} from 'axios';
import {RouterStore} from "mobx-react-router";
import { ResourceStore } from "@reststate/mobx";

import AuthStore from './stores/authStore';
import ProfileStore from './stores/profileStore';

import config from './config'

console.log('API:', config.apiUrl);


const authStore = new AuthStore();

const createHttpClient = () => {
    const httpClient = axios.create({
        baseURL: `${config.apiUrl}/api/`,
        withCredentials: true,
    });


    httpClient.interceptors.request.use((config) => {
        // @ts-ignore
        const finalChar = config.url[config.url.length - 1];

        if (finalChar === '?') {
            // eslint-disable-next-line no-param-reassign
            // @ts-ignore
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
}

const routingStore = new RouterStore();

// @ts-ignore
export default React.createContext({
    routingStore,
    authStore,
    profileStore: new ProfileStore(createHttpClient()),
    todoItemStore: new ResourceStore({name: "todo-items", httpClient: createHttpClient()})
});
