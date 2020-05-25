import * as React from 'react';

import {Badge, Body, Button, Card, CardItem, Icon, Left, Right, Text} from 'native-base';
import moment from 'moment';
import useStores from "../hooks/useStores";
import {observer} from "mobx-react";

function TodoItem({ item }): React.ReactNode {
    //const { todoItemStore } = useStores();

    //const item = todoItemStore.byId({id: itemId});

    const update = (attrs:object) => {
        item.update({attributes: attrs});
    }

    const due = item.attributes.due ? moment(item.attributes.due) : null;
    const overdue = due && due < moment();

    console.log("Rendering item", item.attributes.title);

    return (
        <Card>
            <CardItem>
                <Left>
                    <Body>
                        <Text>{item.attributes.title}</Text>
                        {due ? <Text note>Due {!overdue ? "in " : ""}{due.fromNow()}</Text> : null}
                    </Body>
                </Left>
                <Right style={{flexDirection: 'row-reverse'}}>
                    <Button onPress={() => update({status: 'complete'})}>
                        <Icon name="checkbox" />
                    </Button>
                    {item.attributes.streak ?
                        <Badge info>
                            <Text>{item.attributes.streak}</Text>
                        </Badge>: null}
                </Right>
            </CardItem>
        </Card>
    );
}

export default observer(TodoItem);
