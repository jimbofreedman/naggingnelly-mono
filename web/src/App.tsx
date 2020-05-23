import React from 'react';
import logo from './logo.svg';
import './App.css';

import createBrowserHistory from 'history/createBrowserHistory';
import { syncHistoryWithStore } from 'mobx-react-router';
import useStores from "./hooks/useStores";
import LoginScreen from "./screens/LoginScreen";
import {observer} from "mobx-react";
import HomeScreen from "./screens/HomeScreen";

function App() {
    const { routingStore, authStore } = useStores();
    const browserHistory = createBrowserHistory();
    const history = syncHistoryWithStore(browserHistory, routingStore);

    if (!authStore.isLoggedIn) {
        return <LoginScreen />;
    }

    return (
        <HomeScreen />
    );
}

export default observer(App);
