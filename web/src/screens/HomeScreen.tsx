import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import useStores from '../hooks/useStores';
import Loading from '../components/Loading';
import { observer } from 'mobx-react';
import TodoItem from '../components/TodoItem';
import moment from 'moment';
import {useForm} from "react-hook-form";
import {Button, Divider, FormControl, IconButton, InputBase, Paper, TextField, Typography} from "@material-ui/core";
import config from "../config";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

function HomeScreen() {
    const classes = useStyles();
    const { authStore, profileStore, todoItemStore } = useStores();
    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = (data: Record<string, any>):void => todoItemStore
        .create({
            attributes: {
                title: data.title,
                order: 0
            }
        })
        .then(() => {

        });

    React.useEffect(() => {
        if (!profileStore.loaded) {
            profileStore.load();
        }
        todoItemStore.loadIfNeeded();
    });

    if (!profileStore.loaded || !todoItemStore.loaded) {
        return <Loading />;
    }

    console.log('profile', profileStore.data.id, profileStore.data.attributes.email);
    console.log('tis', todoItemStore.count);

    const filter = (item: { attributes: { title: any; deleted: any; status: string; start: number; snoozeUntil: number }; }) => {
        console.log(item.attributes.title);
        return (
            !item.attributes.deleted &&
            item.attributes.status === 'open' &&
            (!item.attributes.start || moment(item.attributes.start) < moment()) &&
            (!item.attributes.snoozeUntil || moment(item.attributes.snoozeUntil) < moment())
        );
    };

    const sort = (a: { attributes: { order: number; }; }, b: { attributes: { order: number; }; }) => {
        return a.attributes.order - b.attributes.order;
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Paper className={classes.root}>
                        <InputBase
                            name="title"
                            className={classes.input}
                            placeholder="Add new task..."
                            inputProps={{ 'aria-label': 'add new task' }}
                            inputRef={register}
                        />
                        <Divider className={classes.divider} orientation="vertical" />
                        <IconButton type="submit" ref={register} color="primary" className={classes.iconButton} aria-label="add task">
                            <AddIcon />
                        </IconButton>
                </Paper>
            </form>
            {todoItemStore
                .all()
                .filter(filter)
                .sort(sort)
                .map((t:{id:number}) => <TodoItem key={t.id} item={t} />)}
            <Button variant="contained" onClick={authStore.logout}>Logout</Button>
        </div>
    );
}

export default observer(HomeScreen);
