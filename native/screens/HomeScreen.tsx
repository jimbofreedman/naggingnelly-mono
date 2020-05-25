import React from 'react';
import { StyleSheet } from 'react-native';
import {
    Container,
    Text,
    Button,
    Header,
    Card,
    CardItem,
    Left,
    Body,
    Right,
    Icon,
    Form,
    Item,
    Label,
    Input,
    Content,
} from 'native-base';
import useStores from '../hooks/useStores';
import Loading from '../components/Loading';
import { observer } from 'mobx-react';
import TodoItem from '../components/TodoItem';
import moment from 'moment';
import Constants from 'expo-constants';

function HomeScreen(): React.ReactNode {
    const { authStore, profileStore, todoItemStore } = useStores();
    const [newTaskTitle, setNewTaskTitle] = React.useState(null);
    // const [processedItemList, setProcessedItemList] = React.useState([]);

    console.log('Rendering HomeScreen');

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

    const refresh = () => {
        todoItemStore
            .loadAll()
            .then((records) => {
                console.log('Refresh todo-items success');

                //.map((r) => r.d));
            })
            .catch((error) => console.log('Refresh todo-items error'));
    };

    const processedItemList = todoItemStore.all().filter(filter).sort(sort);

    React.useEffect(() => {
        if (!profileStore.loaded) {
            profileStore.load();
        }

        if (!todoItemStore.hasData && !todoItemStore.loading) {
            refresh();
        }

        const todoItemRefresh = setInterval(() => {
            refresh();
        }, 10000);

        return function cleanup() {
            clearInterval(todoItemRefresh);
        };
    });

    if (!profileStore.hasData || !todoItemStore.hasData) {
        return (
            <Container>
                <Text>hi</Text>
                <Loading />
            </Container>
        );
    }

    const createTask = () =>
        todoItemStore
            .create({
                attributes: {
                    title: newTaskTitle,
                    order: 0,
                },
            })
            .then(() => {
                setNewTaskTitle(null);
            });

    return (
        <Container>
            <Content>
                <Form style={{ flexDirection: 'row' }}>
                    <Input
                        placeholder="Add new task"
                        value={newTaskTitle}
                        onChangeText={(text) => setNewTaskTitle(text)}
                    />
                    <Button success disabled={!newTaskTitle || !newTaskTitle.length} onPress={createTask}>
                        <Icon name="checkbox" />
                    </Button>
                </Form>
                {processedItemList.map((item) => (
                    <TodoItem key={item.id} item={item} />
                ))}
                <Button onPress={authStore.logout} title="Logout">
                    <Text>Logout</Text>
                </Button>
            </Content>
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
