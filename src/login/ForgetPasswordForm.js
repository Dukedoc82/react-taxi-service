import React, {useState} from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import {makePostCall} from "../utils/ajaxRequest";
import ReactDOM from "react-dom";
import AccountActivation from "./AccountActivation";
import BlockUi from "react-block-ui";
import Link from "@material-ui/core/Link";
import SignIn from "./SignIn";

const useStyles = makeStyles(theme => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },

}));

const docRoot = document.getElementById('root');

export default function ForgetPasswordForm() {

    const classes = useStyles();

    const [username, setUsername] = useState('');
    const [userNameErrorMsg, setUserNameErrorMsg] = useState('');
    const [blocking, setBlocking] = useState(false);

    const onUserNameChange = (event) => {
        event.preventDefault();
        setUserNameErrorMsg(event.target.value === '' ? 'Email Address can not be empty!' : '');
        setUsername(event.target.value);
    };

    const goToLoginPage = (event) => {
        if (event)
            event.preventDefault();
        localStorage.removeItem('userToken');
        if (window.location.search === '?driver')
            window.location.href = window.location.origin;
        else
            ReactDOM.render(<SignIn/>, document.getElementById('root'));
    };

    const onSubmit = (event) => {
        setBlocking(true);
        event.preventDefault();
        let ajax = {
            body: {
                userName: username
            },
            url: '/resetPassword',
            onSuccess: function() {
                ReactDOM.render(<AccountActivation text="The instructions to restore your password are sent to you e-mail." showLink={false}/>, docRoot);
            },
            onError: function(response) {
                setBlocking(false);
                alert(response.message);
            }
        };
        makePostCall(ajax);
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <BlockUi blocking={blocking}>
                <form className={classes.form} noValidate onSubmit={onSubmit}>
                    <Grid container xs={12}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={onUserNameChange}
                                value={username}
                                helperText={userNameErrorMsg}
                                error={!!userNameErrorMsg}
                            />
                        </Grid>

                        <Grid item xs={5}>
                            <Link href="#" variant="body2" onClick={event => goToLoginPage(event)}>
                                Go to sign in form
                            </Link>
                        </Grid>
                        <Grid item xs={7}>
                            <Grid container justify="flex-end">
                                <Button type="submit"
                                        variant="contained"
                                        color="primary"
                                        onClick={onSubmit}
                                >
                                    Restore password
                                </Button>
                            </Grid>
                        </Grid>

                    </Grid>
                </form>
            </BlockUi>
        </Container>

    );

}