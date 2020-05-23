import 'mobx-react/batchingForReactNative';
import React from 'react';

import { StyleSheet } from 'react-native';

import * as Sentry from 'sentry-expo';
import useStores from './hooks/useStores';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import { observer } from 'mobx-react';

Sentry.init({
    dsn: 'https://b09775658d1147bdac9f7eb190030070@o396764.ingest.sentry.io/5250612',
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
