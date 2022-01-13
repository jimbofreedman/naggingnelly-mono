import React from 'react';
import logo from './logo.svg';
import './App.css';

import { createBrowserHistory } from 'history';
import { syncHistoryWithStore } from 'mobx-react-router';
import useStores from "./hooks/useStores";
import LoginScreen from "./screens/LoginScreen";
import {observer} from "mobx-react";
import HomeScreen from "./screens/HomeScreen";
import DashboardScreen from "./screens/DashboardScreen";
import {Router, Route, Switch} from "react-router";

function App() {
    const { routingStore, authStore } = useStores();
    const browserHistory = createBrowserHistory();
    const history = syncHistoryWithStore(browserHistory, routingStore);

    if (authStore.isLoggedIn === null) {
        return <div>Loading</div>;
    } else if (authStore.isLoggedIn === false) {
        return <LoginScreen />;
    }

    return (
        <Router history={history}>
            <Switch>
                <Route path="/dashboard">
                    <DashboardScreen />
                </Route>
                <Route path="/">
                    <HomeScreen />
                </Route>
            </Switch>
        </Router>
    );
}

export default observer(App);
