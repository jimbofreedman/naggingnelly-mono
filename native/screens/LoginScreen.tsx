import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Container, Form, Item, Label, Input, Button } from 'native-base';
import SnackBar from 'react-native-snackbar-component';

import useStores from '../hooks/useStores';
import Constants from 'expo-constants';

export default function LoginScreen(): React.ReactNode {
    const { authStore } = useStores();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showSnackbar, setShowSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    const submit = () => {
        setShowSnackbar(false);
        authStore
            .loginEmailPassword(email, password)
            .then((response) => console.log('then', response))
            .catch((error) => {
                setShowSnackbar(true);
                setSnackbarMessage(error.message);
            });
    };

    return (
        <Container>
            <Form>
                <Item floatingLabel>
                    <Label>E-mail address</Label>
                    <Input value={email} onChangeText={(text) => setEmail(text)} />
                </Item>
                <Item floatingLabel last>
                    <Label>Password</Label>
                    <Input value={password} onChangeText={(text) => setPassword(text)} secureTextEntry={true} />
                </Item>

                <Button primary onPress={submit}>
                    <Text>Login</Text>
                </Button>
                <Button onPress={authStore.loginGoogle}>
                    <Text>Login with Google</Text>
                </Button>

                <Text>API: {Constants.manifest.extra.apiUrl}</Text>

                <SnackBar position="top" visible={showSnackbar} textMessage={snackbarMessage} />
            </Form>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
