import 'mobx-react/batchingForReactNative';
import React from 'react';

import { StyleSheet } from 'react-native';

import * as Sentry from 'sentry-expo';
import useStores from './hooks/useStores';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import { observer } from 'mobx-react';
import Constants from 'expo-constants';
import Loading from './components/Loading';
import { Container, Text } from 'native-base';

Sentry.init({
    dsn: Constants.manifest.extra.sentryDSN,
    enableInExpoDevelopment: false,
    debug: true,
});

function App() {
    const { authStore } = useStores();

    if (authStore.loading) {
        return (
            <Container>
                <Loading />
            </Container>
        );
    }

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
