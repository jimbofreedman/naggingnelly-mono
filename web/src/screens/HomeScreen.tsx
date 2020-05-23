import React from 'react';
import { Typography, Button } from '@material-ui/core'

import useStores from '../hooks/useStores';
import Loading from '../components/Loading';
import { observer } from 'mobx-react';

function HomeScreen() {
    const { authStore, profileStore } = useStores();

    React.useEffect(() => {
        if (!profileStore.loaded) {
            profileStore.load();
        }
    });

    if (!profileStore.loaded) {
        return (
            <div>
                <Loading />
            </div>
        );
    }

    const { data } = profileStore;
    const { attributes } = data;

    return (
        <div>
            <Typography>Hi {attributes.email}</Typography>
            <Button onClick={authStore.logout}>Logout</Button>
        </div>
    );
}

export default observer(HomeScreen);
