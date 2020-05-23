import 'mobx-react/batchingForReactNative';
import React from 'react';

import { StyleSheet } from 'react-native';

import * as Sentry from 'sentry-expo';
import useStores from './hooks/useStores';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import { observer } from 'mobx-react';

Sentry.init({
    dsn: 'https://d9068b80b6364a2a90b50a14242a95c1@o396764.ingest.sentry.io/5251046',
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
