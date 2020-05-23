import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Text, Button, Card, CardItem, Left, Body, Right, Icon } from 'native-base';
import useStores from '../hooks/useStores';
import Loading from '../components/Loading';
import { observer } from 'mobx-react';
import TodoItem from '../components/TodoItem';
import moment from 'moment';

function HomeScreen(): React.ReactNode {
    const { authStore, profileStore, todoItemStore } = useStores();

    React.useEffect(() => {
        if (!profileStore.loaded) {
            profileStore.load();
        }
        todoItemStore.loadIfNeeded();
    });

    if (!profileStore.loaded || !todoItemStore.loaded) {
        return (
            <Container>
                <Loading />
            </Container>
        );
    }

    console.log('tis', todoItemStore.count);

    const filter = (item) => {
        return (
            !item.attributes.deleted &&
            item.attributes.status === 'open' &&
            (!item.attributes.start || item.attributes.start < moment().format())
        );
    };

    const sort = (a, b) => {
        return a.attributes.order - b.attributes.order;
    };

    return (
        <Container>
            <Text>Hi {profileStore.data.attributes.email}</Text>
            {todoItemStore
                .all()
                .filter(filter)
                .sort(sort)
                .map((t) => (
                    <TodoItem key={t.id} item={t} />
                ))}
            <Button onPress={authStore.logout} title="Logout">
                <Text>Logout</Text>
            </Button>
        </Container>
    );
}

export default observer(HomeScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
