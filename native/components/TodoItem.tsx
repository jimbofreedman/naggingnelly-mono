import * as React from 'react';

import {Badge, Body, Button, Card, CardItem, Icon, Left, Right, Text} from 'native-base';
import moment from 'moment';

export default function TodoItem({ item }): React.ReactNode {
    const update = (attrs:object) => {
        item.update({attributes: attrs});
    }

    const due = item.attributes.due ? moment(item.attributes.due) : null;
    const overdue = due && due < moment();

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