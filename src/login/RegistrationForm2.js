import React from 'react';
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
import validateIsNotEmpty from '../utils/ValidationUtils'

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

let shouldUpdate = true;

export default class RegistrationForm2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: '',

            firstNameError: false,
            lastNameError: false,
            emailError: false,
            passwordError: false,
            phoneNumberError: false,

            firstNameErrorMsg: '',
            lastNameErrorMsg: '',
            emailErrorMsg: '',
            passwordErrorMsg: '',
            phoneNumberErrorMsg: ''
        };


        this.tmpState = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: ''
        }
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        return true;
    }

    onSubmit = (event) => {

        event.preventDefault();
        setTimeout(function(that) {

        console.log(that.tmpState);
        alert(1);
        that.validate();
        }, 500, this);
    }

    handleInputChange =(e) => {
        console.log(e.target.name + ' ' + e.target.value);
        //e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    firstNameValidationCallback = (isValid) => {
        if (isValid) {
            this.setState({
                firstNameError: false,
                firstNameErrorMsg: ''
            });
        } else {
            this.setState({
                firstNameError: true,
                firstNameErrorMsg: 'First Name can not be empty.'
            });
        }

    }

    validate = () => {
        console.log("validate");
        return validateIsNotEmpty(this.state.firstName, this.firstNameValidationCallback);
    }

    render() {
        const {firstName, lastName, email, password, phone} =  this.state;
        const SignUp = () => {
            const classes = useStyles();
            console.log(new Date());

            /*return (
                <Container component="main" maxWidth="xs" id='cibteas'>
                    <CssBaseline />
                    <div className={classes.paper} id='vfdddds'>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <form className={classes.form} onSubmit={this.onSubmit} noValidate id='djksdnjkas'>
                            <Grid container spacing={2} id='jgfdsuyt'>
                                <Grid item xs={12} id='zxcvzxcvzxzx'>
                                    <TextField
                                        autoComplete="fname"
                                        name="firstName"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                        error={this.state.firstNameError}
                                        value={this.state.firstName}
                                        onChange={(e)=>this.setState({firstName: e.target.value})}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="lastName"
                                        key="lastNameInput"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="lname"
                                        error={this.state.lastNameError}
                                        onChange={((e)=>this.setState({lastName: e.target.value}))}
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
                                        type="email"
                                        autoComplete="email"
                                        error={this.state.emailError}
                                        onChange={this.handleInputChange}
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
                                        value={this.state.password}
                                        autoComplete="current-password"
                                        error={this.state.passwordError}
                                        onChange={this.handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="phone"
                                        label="Phone"
                                        type="tel"
                                        id="phone"
                                        autoComplete="phone"
                                        value={this.state.phone}
                                        inputProps={{
                                            required: true,
                                            name: 'phone',
                                            pattern: '8-(9[0-9]{2})-[0-9]{3}-[0-9]{4}',
                                            type: 'tel'
                                        }}
                                        error={this.state.phoneNumberError}
                                        onChange={this.handleInputChange}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Sign Up
                            </Button>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Container>
            );*/
            return (
                <form>
                    <input type="email" key='111' value={this.state.email} onChange={(event => this.setState({email: event.target.value}))}/>
                    <input type="submit"/>

                </form>
            )
        }
        return <SignUp/>
    }
}