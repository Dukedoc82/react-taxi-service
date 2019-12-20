import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { green } from '@material-ui/core/colors';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ReactPhoneInput from "react-phone-input-mui";
import validateIsNotEmpty from "../utils/ValidationUtils";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import clsx from 'clsx';
import AlertDialog from "../components/AlertDialog";
import ReactDOM from 'react-dom';
import {makePostCall} from "../utils/ajaxRequest";
import SignIn from "./SignIn";

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

function MySnackbarContentWrapper(props) {
    const classes = useStyles();
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={clsx(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
                    {message}
        </span>
            }
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
            {...other}
        />
    );
}

MySnackbarContentWrapper.propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['success']).isRequired,
};

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(1),
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
    errorSpan: {
        color: '#f44336',
        margin: '8px 14px 0',
        'font-size': '0.75rem'
    },
    success: {
        backgroundColor: green[600],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    }
}));

export default function SignUp() {
    const classes = useStyles();

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('');
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState('');
    const [userNameErrorMessage, setUserNameErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState('');

    const [successMessageOpen, setSuccessMessageOpen] = useState(false);
    const [alertDialogTitle, setAlertDialogTitle] = useState('Success');
    const [alertDialogMessage, setAlertDialogMessage] = useState('');

    const goToLoginPage = (event) => {
        if (event)
            event.preventDefault();
        ReactDOM.render(<SignIn/>, document.getElementById('root'));
    }

    const onSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            let body = {
                userName: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber
            }
           makePostCall('/register', body, onSuccessRegister, onFailRegister);
        }
    }

    const onSuccessRegister = (response) => {
        setAlertDialogTitle('Success');
        setAlertDialogMessage('User ' + username + ' successfully registered.');
        setSuccessMessageOpen(true);
    }

    const onFailRegister = (response) => {
        setAlertDialogTitle('Error');
        let msg = response.message;
        if (msg.includes('ConstraintViolationException'))
            msg = 'User with such email address or phone number already registered!';
        setAlertDialogMessage(msg);
        setSuccessMessageOpen(true);
    }

    const onUsernameChange = (event) => {
        event.preventDefault();
        setUsername(event.target.value);
    }

    const onFirstNameChange = (event) => {
        event.preventDefault();
        setFirstName(event.target.value);
    }

    const onLastNameChange = (event) => {
        event.preventDefault();
        setLastName(event.target.value);
    }

    const onPasswordChange = (event) => {
        event.preventDefault();
        setPassword(event.target.value);
    }

    const onPnoneNumberChange = (value) => {
        const phoneNum = value.startsWith('8') || value.startsWith('+8')
            ? value.replace('8', '+7')
            : value;
        setPhoneNumber(phoneNum);
    }

    const userNameIsEmptyCallback = () => {
        setUserNameErrorMessage('Email can not be empty!');
    }

    const userNameOKCallback = () => {
        setUserNameErrorMessage('');
    }

    const firstNameIsNotValidCallback = () => {
        setFirstNameErrorMessage('First Name can not be empty!');
    }

    const firstNameOKCallback = () => {
        setFirstNameErrorMessage('');
    }

    const lastNameIsNotValidCallback = () => {
        setLastNameErrorMessage("Last Name can not be empty!");
    }

    const lastNameOKCallback = () => {
        setLastNameErrorMessage('');
    }

    const validatePassword = (value) => {
        let msg = '';
        if (!validateIsNotEmpty(value)) {
            msg = 'Password can not be empty!';
        } else if (value.length < 8) {
            msg = 'Password must be at least 8 characters length!';
        } else if(!/\d/.test(value)) {
            msg = 'Password must contain at least 1 digit!'
        } else if(!/[a-z]/.test(value)) {
            msg = 'Password must contain at least 1 latin symbol in lower case!';
        } else if(!/[A-Z]/.test(value)) {
            msg = 'Password must contain at least 1 latin symbol in upper case!';
        } else if(/[^0-9a-zA-Z/!@#$%^&*()\-+=\]\[_]/.test(value)) {
            msg = 'Password allows latin symbols and !@#$%^&*()\\-+=][_ symbols only!';
        }
        setPasswordErrorMessage(msg);
        return !msg;
    }

    const phoneNumberIsEmptyCallback = () => {
        setPhoneNumberErrorMessage('Phone Number can not be empty!');
    }

    const phoneNumberOKCallback = () => {
        setPhoneNumberErrorMessage('');
    }

    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSuccessMessageOpen(false);
        if (alertDialogTitle === 'Success')
            goToLoginPage();
    };

    const validatePhoneNumber = (value) => {
        let phoneNum = value.split('(').join('')
            .split(')').join('')
            .split(' ').join('')
            .split('-').join('')
            .replace('+', '');
        if (validateIsNotEmpty(phoneNumber, phoneNumberOKCallback, phoneNumberIsEmptyCallback)) {
            if (phoneNum.length != 11) {
                setPhoneNumberErrorMessage('Phone number must contain 10 digits after country code!');
                return false;
            } else {
                setPhoneNumberErrorMessage('');
                return true;
            }
        } else {
            return false;
        }
    }

    const validateForm = () => {
        let isUserNameValid = validateIsNotEmpty(username, userNameOKCallback, userNameIsEmptyCallback);
        let isFirstNameValid = validateIsNotEmpty(firstName, firstNameOKCallback, firstNameIsNotValidCallback);
        let isLastNameValid = validateIsNotEmpty(lastName, lastNameOKCallback, lastNameIsNotValidCallback);
        let isPasswordValid = validatePassword(password);
        let isPhoneNumberValid = validatePhoneNumber(phoneNumber);
        return isUserNameValid && isFirstNameValid && isLastNameValid && isPasswordValid && isPhoneNumberValid;

    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form} noValidate onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                helperText={firstNameErrorMessage}
                                error={!!firstNameErrorMessage}
                                value={firstName}
                                onChange={onFirstNameChange}
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
                                value={lastName}
                                onChange={onLastNameChange}
                                helperText={lastNameErrorMessage}
                                error={!!lastNameErrorMessage}
                                autoComplete="lname"
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
                                value={username}
                                onChange={onUsernameChange}
                                helperText={userNameErrorMessage}
                                error={!!userNameErrorMessage}
                                autoComplete="email"
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
                                value={password}
                                onChange={onPasswordChange}
                                helperText={passwordErrorMessage}
                                error={!!passwordErrorMessage}
                                autoComplete="current-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ReactPhoneInput
                                onlyCountries={['ru']}
                                defaultCountry={'ru'}
                                onChange={onPnoneNumberChange}
                                component={TextField}
                                value={phoneNumber}
                                inputExtraProps={{
                                    required: true,
                                    name: 'phone',
                                    pattern: '8-(9[0-9]{2})-[0-9]{3}-[0-9]{4}',
                                    type: 'tel'
                                }}
                            />
                            <p className={classes.errorSpan}>{phoneNumberErrorMessage}</p>
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
                    <AlertDialog open={successMessageOpen} message={alertDialogMessage}
                                 handleClose={handleSnackBarClose} title={alertDialogTitle}/>

                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="#" variant="body2" onClick={event => goToLoginPage(event)}>
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}