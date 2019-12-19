import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ReactPhoneInput from 'react-phone-input-mui';
import {makePostCall} from "../utils/ajaxRequest";
import ReactDOM from "react-dom";
import ModalForm2 from "./ModalForm2";
import InputField from "../components/InputField";

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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const SubmitButton = () => {
    const classes = useStyles();
    return (
        <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
        >
            Sign Up
        </Button>
    )
}

const SignUpDiv = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
                <LockOpenOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign Up
            </Typography>
            <form className={classes.form} noValidate onSubmit={props.onSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <InputField
                            autoComplete="fname"
                            name="firstName"
                            id="firstName"
                            label="First Name"
                            autoFocus
                            onChange={props.onFirstNameChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="lname"
                            onChange={props.onLastNameChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            error
                            onChange={props.onUserNameChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={props.onPasswordChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <span id='passwordErrorSpan' style={{color: '#f00'}}></span>
                    </Grid>
                    <Grid item xs={12}>
                        <ReactPhoneInput
                            onlyCountries={['ru']}
                            defaultCountry={'ru'}
                            onChange={props.onPhoneChange}
                            component={TextField}
                            inputExtraProps={{
                                required: true,
                                name: 'phone',
                                pattern: '8-(9[0-9]{2})-[0-9]{3}-[0-9]{4}',
                                type: 'tel'
                            }}
                        />
                    </Grid>
                </Grid>
                <SubmitButton/>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Link href="#" variant="body2" onClick={props.onSignInClick}>
                            Already have an account? Sign in
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

const SignUp = (props) => {
    const classes = useStyles();
    console.log(props);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <SignUpDiv/>
        </Container>
    );
}

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            phone:''
        }
    }

    onSubmit = (event) => {
        event.preventDefault();
        document.getElementById('passwordErrorSpan').textContent = "Error!"
        //console.log(this.props);
        /*let body = {
            userName: this.state.username,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phone
        }
        makePostCall("/register", body, this.onRegisterSuccess, this.onRegisterError)*/
    }

    onFirstNameChange = (event) => {
        event.preventDefault();
        this.state.firstName = event.target.value;
    }

    onLastNameChange = (event) => {
        event.preventDefault();
        this.state.lastName = event.target.value;
        this.state.label = event.target.value;
    }

    onUsernameChange = (event) => {
        event.preventDefault();
        console.log(event.target.value);
        this.state.username = event.target.value;
    }

    onPhoneChange = (value) => {
        this.state.phone = value;
    }

    onPasswordChange = (event) => {
        event.preventDefault();
        this.state.password = event.target.value;
    }

    onRegisterSuccess = (response) => {
        alert("User successfully registered.");
        ReactDOM.render(<ModalForm2 />, document.getElementById('root'));
    }

    onRegisterError = (response) => {
        alert(response);
    }

    onSignInClick = (event) => {
        alert(1);
        event.preventDefault();
        ReactDOM.render(<ModalForm2 />, document.getElementById('root'));
    }

    render() {
        return (
            <SignUp
                onSubmit={this.onSubmit}
                onUserNameChange={this.onUsernameChange}
                onPasswordChange={this.onPasswordChange}
                onPhoneChange={this.onPhoneChange}
                onFirstNameChange={this.onFirstNameChange}
                onLastNameChange={this.onLastNameChange}
                onSignInClick={this.onSignInClick}
                label={this.state.label}
            >
            </SignUp>
        );
    }
}