import React from 'react';
import {OnSubmit, useForm} from 'react-hook-form';

import config from '../config';
import useStores from '../hooks/useStores';
import {Button, FormControl, TextField, Typography} from "@material-ui/core";

export default function LoginScreen() {
    const { authStore } = useStores();
    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = (data: Record<string, any>):void => {
        console.log("Form data", data);
        //setShowSnackbar(false);
        authStore
            .loginEmailPassword(data.email, data.password)
            .then((response) => console.log('then', response))
            .catch((error) => {
                //setShowSnackbar(true);
                //setSnackbarMessage(error.message);
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                    <TextField
                        name="email"
                        label="E-mail address"
                        inputRef={register}
                    />
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        inputRef={register}
                    />
                    <Button type="submit" color="primary" ref={register}>Login</Button>
                    {/*<Button type="button" onClick={authStore.loginFacebook}>Facebook</Button>*/}
                    {/*<Button type="button" onClick={authStore.loginGoogle}>Login with Google</Button>*/}

                    <Typography>API: {config.apiUrl}</Typography>

                    {/*<SnackBar position="top" visible={showSnackbar} textMessage={snackbarMessage} />*/}
                </FormControl>
            </form>
        </div>
    );
}

