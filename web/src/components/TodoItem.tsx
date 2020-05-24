import * as React from 'react';
import CheckIcon from '@material-ui/icons/Check';

import moment from 'moment';
import {Button, Card, CardContent, Typography, Badge, CardHeader, IconButton, Avatar} from "@material-ui/core";

// @ts-ignore
export default function TodoItem({ item }) {
    const update = (attrs:object) => {
        item.update({attributes: attrs});
    }

    const due = item.attributes.due ? moment(item.attributes.due) : null;
    const overdue = due && due < moment();

    return (
        <Card>
            <CardHeader
                avatar={
                    item.attributes.streak ?
                        <Avatar aria-label="streak">
                            {item.attributes.streak}
                        </Avatar> : null
                }
                action={
                    <IconButton aria-label="complete" onClick={() => update({status: 'complete'})}>
                        <CheckIcon />
                    </IconButton>
                }
                title={item.attributes.title}
                subheader={due ? `Due ${!overdue ? "in " : ""}${due.fromNow()}` : null}
            />
        </Card>
    );
}
