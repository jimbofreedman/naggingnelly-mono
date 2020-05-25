import * as React from 'react';

import {Badge, Body, Button, Card, CardItem, DatePicker, Icon, Left, Right, Text} from 'native-base';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment, {Moment} from 'moment';
import { observer } from 'mobx-react';

function TodoItem({ item }): React.ReactNode {
    const [menuActive, setMenuActive] = React.useState(false);
    const [snoozePickerOpen, setSnoozePickerOpen] = React.useState(false);
    const [duePickerOpen, setDuePickerOpen] = React.useState(false);

    const update = (attrs: object) => {
        item.update({ attributes: attrs });
    };

    const setSnooze = (date: Date | undefined) => {
        update({
            snoozeUntil: date
        });
        setSnoozePickerOpen(false)
    };

    const setDue = (date: Date | undefined) => {
        update({
            due: date
        });
        setDuePickerOpen(false)
    };

    const due = item.attributes.due ? moment(item.attributes.due) : null;
    const overdue = due && due < moment();

    console.log('Rendering item', item.attributes.title);

    return (
        <Card>
            <CardItem>
                <Left>
                    <Body>
                        <Text>{item.attributes.title}</Text>
                        {due ? (
                            <Text note>
                                Due {!overdue ? 'in ' : ''}
                                {due.fromNow()}
                            </Text>
                        ) : null}
                    </Body>
                </Left>
                <Right style={{ flexDirection: 'row-reverse' }}>
                    <Button onPress={() => update({ status: 'complete' })}>
                        <Icon name="checkbox" />
                    </Button>
                    <Button onPress={() => setMenuActive(!menuActive)}>
                        <Icon name="menu" />
                    </Button>

                    {item.attributes.streak ? (
                        <Badge info>
                            <Text>{item.attributes.streak}</Text>
                        </Badge>
                    ) : null}
                </Right>
            </CardItem>
            {menuActive ? <CardItem>
                <Left>
                    <Button onPress={() => setSnoozePickerOpen(true)}>
                        <Text>Snooze until</Text>
                    </Button>
                    <Button onPress={() => setDuePickerOpen(true)}>
                        <Text>Set due date</Text>
                    </Button>
                </Left>
            </CardItem> : null}
            <DateTimePickerModal
                isVisible={snoozePickerOpen}
                value={new Date(item.attributes.snoozeUntil) || new Date()}
                mode="date"
                display="calendar"
                onConfirm={setSnooze}
                onCancel={() => setSnoozePickerOpen(false)}
            />
            <DateTimePickerModal
                isVisible={duePickerOpen}
                value={new Date(item.attributes.due) || new Date()}
                mode="date"
                display="calendar"
                onConfirm={setDue}
                onCancel={() => setSnoozePickerOpen(false)}
            />
        </Card>
    );
}

export default observer(TodoItem);
