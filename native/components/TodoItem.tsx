import * as React from 'react';

import {Badge, Body, Button, Card, CardItem, DatePicker, Icon, Left, Right, Text} from 'native-base';
import moment, {Moment} from 'moment';
import { observer } from 'mobx-react';

function TodoItem({ item }): React.ReactNode {
    const [menuActive, setMenuActive] = React.useState(false);
    const update = (attrs: object) => {
        item.update({ attributes: attrs });
    };

    const setSnooze = (date: Moment | null) => {
        update({
            snoozeUntil: date
        });
        //setSnoozePickerOpen(false)
    };

    const setDue = (date: Moment | null) => {
        update({
            due: date
        });
        //setSnoozePickerOpen(false)
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
                    <Button>
                        <Text>Snooze until</Text>
                    </Button>
                    <Button>
                        <Text>Set due date</Text>
                    </Button>
                </Left>
            </CardItem> : null}
            <DatePicker
                defaultDate={new Date(2018, 4, 4)}
                minimumDate={new Date(2018, 1, 1)}
                maximumDate={new Date(2018, 12, 31)}
                locale={"en"}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={"fade"}
                androidMode={"default"}
                placeHolderText="Select date"
                textStyle={{ color: "green" }}
                placeHolderTextStyle={{ color: "#d3d3d3" }}
                onDateChange={setSnooze}
                disabled={false}
            />
        </Card>
    );
}

export default observer(TodoItem);
