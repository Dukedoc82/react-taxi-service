import React, {useState} from 'react';
import Container from "@material-ui/core/Container";
import BlockUi from "react-block-ui";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import EditIcon from '@material-ui/icons/Edit';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import ReactPhoneInput from "react-phone-input-mui";
import Button from "@material-ui/core/Button";
import AlertDialog from "../components/dialogs/AlertDialog";
import {makeStyles} from "@material-ui/core";
import {green} from "@material-ui/core/colors";
import {makeGetCall, makePostCall} from "../utils/ajaxRequest";
import {validateIsNotEmpty} from "../utils/ValidationUtils";

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

export default function UserDetailsDialog() {

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
    const [dataChanged, setDataChanged] = useState(false);

    const [successMessageOpen, setSuccessMessageOpen] = useState(false);
    const [alertDialogTitle, setAlertDialogTitle] = useState('Success');
    const [alertDialogMessage, setAlertDialogMessage] = useState('');


    const [isUpdated, setIsUpdated] = useState(false);

    const [blocking, setBlocking] = useState(false);

    const onSubmit = (event) => {
        event.preventDefault();
        setBlocking(true);
        let body = {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber
        };
        if (password.trim() !== '') {
            body.password = password;
        }
        let ajax = {
            body: body,
            url: '/profile/update',
            onSuccess: function(response) {
                setBlocking(false);
                setAlertDialogTitle('Success');
                setAlertDialogMessage('Profile successfully updated.');
                setSuccessMessageOpen(true);

                let userData = JSON.parse(localStorage.getItem('userData'));
                userData.firstName = response.firstName;
                userData.lastName = response.lastName;
                localStorage.setItem('userData', JSON.stringify(userData));

            }
        };
        if (validateForm()) {
            makePostCall(ajax);
        } else {
            setBlocking(false);
        }
    };

    const getUserData = () => {
        setBlocking(true);
        let ajax = {
            url: "/me",
            onSuccess: function(response) {
                setUsername(response.userName);
                setFirstName(response.firstName);
                setLastName(response.lastName);
                setPhoneNumber(response.phoneNumber);
                setBlocking(false);
            },
            onError:function() {
                setBlocking(false);
            }
        };
        makeGetCall(ajax);
    };

    const onUsernameChange = (event) => {
        event.preventDefault();
        setUsername(event.target.value);
        setDataChanged(true);
        setUserNameErrorMessage(!!event.target.value ? '' : userNameErrorMessage);
    };

    const onFirstNameChange = (event) => {
        event.preventDefault();
        setFirstName(event.target.value);
        setDataChanged(true);
        setFirstNameErrorMessage(!!event.target.value ? '' : firstNameErrorMessage);
    };

    const onLastNameChange = (event) => {
        event.preventDefault();
        setLastName(event.target.value);
        setDataChanged(true);
        setLastNameErrorMessage(!!event.target.value ? '' : lastNameErrorMessage);
    };

    const onPasswordChange = (event) => {
        event.preventDefault();
        setPassword(event.target.value);
        setDataChanged(true);
        setPasswordErrorMessage(!!event.target.value ? '' : passwordErrorMessage);
    };

    const onPnoneNumberChange = (value) => {
        const phoneNum = value.startsWith('8') || value.startsWith('+8')
            ? value.replace('8', '+7')
            : value;
        setPhoneNumber(phoneNum);
        setDataChanged(true);
        setPhoneNumberErrorMessage(!!value ? '' : phoneNumberErrorMessage);
    };

    const userNameIsEmptyCallback = () => {
        setUserNameErrorMessage('Email can not be empty!');
    };

    const userNameOKCallback = () => {
        setUserNameErrorMessage('');
    };

    const firstNameIsNotValidCallback = () => {
        setFirstNameErrorMessage('First Name can not be empty!');
    };

    const firstNameOKCallback = () => {
        setFirstNameErrorMessage('');
    };

    const lastNameIsNotValidCallback = () => {
        setLastNameErrorMessage("Last Name can not be empty!");
    };

    const lastNameOKCallback = () => {
        setLastNameErrorMessage('');
    };

    const validatePassword = (value) => {
        let msg = '';
        const errorMsg = 'Password must be at least 8 characters length, contain at least 1 digit, 1 symbol in lower ' +
            'case, one symbol in upper case and allows latin symbols, digits and !@#$%^&*()\\-+=][_ symbols only.!';
        if (value.trim() === '')
            return true;
        if (value.length < 8
            || !/\d/.test(value)
            || !/[a-z]/.test(value)
            || !/[A-Z]/.test(value)
            || /[^0-9a-zA-Z/!@#$%^&*()\-+=\][_]/.test(value)) {
            msg = errorMsg;
        }
        setPasswordErrorMessage(msg);
        return !msg;
    };

    const phoneNumberIsEmptyCallback = () => {
        setPhoneNumberErrorMessage('Phone Number can not be empty!');
    };

    const phoneNumberOKCallback = () => {
        setPhoneNumberErrorMessage('');
    };

    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSuccessMessageOpen(false);
    };

    const validatePhoneNumber = (value) => {
        let phoneNum = value.split('(').join('')
            .split(')').join('')
            .split(' ').join('')
            .split('-').join('')
            .replace('+', '');
        if (validateIsNotEmpty(phoneNumber, phoneNumberOKCallback, phoneNumberIsEmptyCallback)) {
            if (phoneNum.length !== 11) {
                setPhoneNumberErrorMessage('Phone number must contain 10 digits after country code!');
                return false;
            } else {
                setPhoneNumberErrorMessage('');
                return true;
            }
        } else {
            return false;
        }
    };

    const validateForm = () => {
        let isUserNameValid = validateIsNotEmpty(username, userNameOKCallback, userNameIsEmptyCallback);
        let isFirstNameValid = validateIsNotEmpty(firstName, firstNameOKCallback, firstNameIsNotValidCallback);
        let isLastNameValid = validateIsNotEmpty(lastName, lastNameOKCallback, lastNameIsNotValidCallback);
        let isPasswordValid = validatePassword(password);
        let isPhoneNumberValid = validatePhoneNumber(phoneNumber);
        return isUserNameValid && isFirstNameValid && isLastNameValid && isPasswordValid && isPhoneNumberValid;

    };

    if (!isUpdated) {
        setIsUpdated(true);
        getUserData();
    }

    return (
        <Container component="main" maxWidth="xs">
            <BlockUi tag="div" blocking={blocking}>
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <EditIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Edit profile
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
                                <TextField disabled={true}
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
                                    onBlur={(e)=> onPnoneNumberChange(e.target.value)}
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
                            disabled={!dataChanged}
                        >
                            Update
                        </Button>
                        <AlertDialog open={successMessageOpen} message={alertDialogMessage}
                                     handleClose={handleSnackBarClose} title={alertDialogTitle}/>

                    </form>
                </div>
            </BlockUi>
        </Container>
    );
}