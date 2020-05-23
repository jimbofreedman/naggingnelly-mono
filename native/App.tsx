import 'mobx-react/batchingForReactNative';
import React from 'react';

import { StyleSheet } from 'react-native';

import * as Sentry from 'sentry-expo';
import useStores from './hooks/useStores';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import { observer } from 'mobx-react';
import Constants from "expo-constants";

Sentry.init({
    dsn: Constants.manifest.extra.sentryDSN,
    enableInExpoDevelopment: false,
    debug: true,
});

function App() {
    const { authStore } = useStores();

    return authStore.isLoggedIn ? <HomeScreen /> : <LoginScreen />;
}

export default observer(App);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
