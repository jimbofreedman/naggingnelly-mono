import * as React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import MenuIcon from '@material-ui/icons/Menu';
import {DatePicker, DateTimePicker} from "@material-ui/pickers";

import moment, {Moment} from 'moment';
import {
    Button,
    Card,
    CardContent,
    Typography,
    Badge,
    CardHeader,
    IconButton,
    Avatar,
    useTheme,
    CardMedia, CardActions, MenuItem, Menu
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {observer} from "mobx-react";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flex: '1 0 auto',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));

// @ts-ignore
function TodoItem({ item }) {
    const classes = useStyles();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState<Element|null>(null);
    const [snoozePickerOpen, setSnoozePickerOpen] = React.useState(false);
    const [duePickerOpen, setDuePickerOpen] = React.useState(false);

    const handleClick = (event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const update = (attrs:object) => {
        item.update({attributes: attrs});
    }

    const setSnooze = (date: Moment | null) => {
        update({
            snoozeUntil: date
        });
        setSnoozePickerOpen(false)
    };

    const setDue = (date: Moment | null) => {
        update({
            due: date
        });
        setDuePickerOpen(false)
    };

    const due = item.attributes.due ? moment(item.attributes.due) : null;
    const now = moment()
    const overdue = due && due < now;

    function getBackgroundColour() {
        if (!due) {
            return null;
        } else if (overdue) {
            return "error.main";
        } else if (due < now.endOf("day")) {
            return "info.main";
        } else if (item.attributes.start && item.attributes.start > now) {
            return "text.disabled";
        }
        return null;
    }

    console.log('Rendering', item.attributes.title);

    return (
        <Card className={classes.root}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h6" variant="h6">
                        {item.attributes.title}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                        {due ? `Due ${!overdue ? "in " : ""}${due.fromNow()}` : null}
                    </Typography>
                </CardContent>
            </div>
            <CardActions>
                <DatePicker
                    style={{display: "none"}}
                    variant="dialog"
                    value={moment()}
                    open={snoozePickerOpen}
                    onChange={() => {}}
                    onAccept={setSnooze}
                    onClose={() => setSnoozePickerOpen(false)}
                    disablePast
                />
                <DateTimePicker
                    style={{display: "none"}}
                    variant="dialog"
                    value={moment()}
                    open={duePickerOpen}
                    onChange={() => {}}
                    onAccept={setDue}
                    onClose={() => setDuePickerOpen(false)}
                    disablePast
                />
                {item.attributes.streak ?
                <Avatar aria-label="streak">
                    {item.attributes.streak}
                </Avatar> : null}
                <Menu
                    id="task-extras-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => setSnoozePickerOpen(true)}>Snooze</MenuItem>
                    <MenuItem onClick={() => setDuePickerOpen(true)}>Set Due Date</MenuItem>
                    <MenuItem onClick={() => update({status: 'cancelled'})}>Cancel</MenuItem>
                    <MenuItem onClick={() => update({status: 'failed'})}>Fail</MenuItem>
                </Menu>
                <IconButton aria-controls="task-extras-menu" aria-haspopup="true" onClick={handleClick}>
                    <MenuIcon />
                </IconButton>
                <IconButton aria-label="complete" onClick={() => update({status: 'complete'})}>
                    <CheckIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}

export default observer(TodoItem);
