import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ReactDOM from 'react-dom';
import SignUp from './SignUp';
import {makePostCall} from "../utils/ajaxRequest";
import AppPage from "../content/AppPage";
import ForgetPasswordForm from "./ForgetPasswordForm";

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const openSignUp = (event) => {
    event.preventDefault();
    ReactDOM.render(<SignUp/>, document.getElementById('root'));
};

export default function SignIn() {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [userNameErrorMsg, setUserNameErrorMsg] = useState('');
    const [password, setPassword] = useState('');
    const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

    const onPasswordChange = (event) => {
        event.preventDefault();
        setPasswordErrorMsg(event.target.value === '' ? 'Password can not be empty!' : '');
        setUserNameErrorMsg(username === '' ? 'Email Address can not be empty!' : '');
        setPassword(event.target.value);
    };

    const onUserNameChange = (event) => {
        event.preventDefault();
        setUserNameErrorMsg(event.target.value === '' ? 'Email Address can not be empty!' : '');
        setUsername(event.target.value);
    };

    const onSuccessAuth = (response) => {
        localStorage.setItem('userData', JSON.stringify(response));
        console.log(JSON.stringify(response));
        ReactDOM.render(<AppPage/>, document.getElementById('root'));
    };

    const onError = () => {
        setUserNameErrorMsg('No such Email Address/Password found');
    };

    const onAuthError = () => {
        setUserNameErrorMsg('No such Email Address/Password found');
    };

    const onDisabledError = () => {
        setUserNameErrorMsg('User is not activated.');
    };

    const validate = () => {
        const isUserNameValid = validateUserName();
        const isPasswordValid = validatePassword();
        return isUserNameValid && isPasswordValid;
    };

    const validateUserName = () => {
        return !!username || setUserNameErrorMsg('Email Address can not be empty!');
    };

    const validatePassword = () => {
        return !!password || setPasswordErrorMsg('Password can not be empty!');
    };

    const onSubmit = (event) => {
        event.preventDefault();
        let ajax = {
            url: '/authenticate',
            body: {
                username: username,
                password: password
            },
            onSuccess: onSuccessAuth,
            onError: onError,
            onAuthError: onAuthError,
            onDisabledError: onDisabledError
        };
        validate() && makePostCall(ajax);
    };

    const openForgetPasswordForm = (event) => {
        event.preventDefault();
        ReactDOM.render(<ForgetPasswordForm/>, document.getElementById('root'));
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate onSubmit={onSubmit}>
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
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={onPasswordChange}
                        value={password}
                        helperText={passwordErrorMsg}
                        error={!!passwordErrorMsg}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2" onClick={(e) => openForgetPasswordForm(e)}>
                                Forget password?
                            </Link>

                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2" onClick={openSignUp}>
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}