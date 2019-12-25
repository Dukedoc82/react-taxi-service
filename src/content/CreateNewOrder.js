import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { green } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { validateIsNotEmpty } from "../utils/ValidationUtils";
import ReactDOM from 'react-dom';
import {makePostCall} from "../utils/ajaxRequest";
import OrdersTable from './OrdersTable'
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

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

export default function CreateNewOrder() {
    const ADDRESS_FROM_ERR_MSG = 'Specify the address where you\'re going from.';
    const ADDRESS_TO_ERR_MSG = 'Specify the address where you\'re going to.';

    const classes = useStyles();

    const currentTime = new Date();

    const [addressFrom, setAddressFrom] = useState('');
    const [addressTo, setAddressTo] = useState('');
    const [selectedTime, setSelectedTime] =
        useState(new Date(2020, 2, 8, currentTime.getHours(), currentTime.getMinutes()));
    const [addressFromError, setAddressFromError] = useState('');
    const [addressToError, setAddressToError] = useState('');

    const onAddressFromChange = (event) => {
        event.preventDefault();
        setAddressFrom(event.target.value);
        setAddressFromError(event.target.value ? '' : ADDRESS_FROM_ERR_MSG);
    };

    const onAddressToChange = (event) => {
        event.preventDefault();
        setAddressTo(event.target.value);
        setAddressToError(event.target.value ? '' : ADDRESS_TO_ERR_MSG);
    };

    const openOrdersTable = (event) => {
        event.preventDefault();
        ReactDOM.render(<OrdersTable/>, document.getElementById('mainContent'));
    };

    const onSuccessCreate = () => {
        ReactDOM.render(<OrdersTable/>, document.getElementById('mainContent'));
    };

    const onCorrectAddressFrom = () => {
        setAddressFromError('');
    };

    const onInvalidAddressFrom = () => {
        setAddressFromError(ADDRESS_FROM_ERR_MSG);
    };

    const onCorrectAddressTo = () => {
        setAddressToError('');
    };

    const onInvalidAddressTo = () => {
        setAddressToError(ADDRESS_TO_ERR_MSG);
    };

    const onSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            let body = {
                addressFrom: addressFrom,
                addressTo: addressTo,
                appointmentDate: selectedTime.toISOString()
            };
            makePostCall("/order/new", body, onSuccessCreate);
        }
    };

    const validateForm = () => {
        let addrFromIsNotEmpty = validateIsNotEmpty(addressFrom, onCorrectAddressFrom, onInvalidAddressFrom);
        let addrToIsNotEmpty = validateIsNotEmpty(addressTo, onCorrectAddressTo, onInvalidAddressTo);
        return addrFromIsNotEmpty && addrToIsNotEmpty;
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    New order
                </Typography>
                <form className={classes.form} noValidate onSubmit={onSubmit}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="addressFrom"
                                variant="outlined"
                                required
                                fullWidth
                                id="addressFrom"
                                label="From Address"
                                autoFocus
                                value={addressFrom}
                                onChange={onAddressFromChange}
                                helperText={addressFromError}
                                error={!!addressFromError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="addressTo"
                                label="To Address"
                                name="addressTo"
                                value={addressTo}
                                onChange={onAddressToChange}
                                helperText={addressToError}
                                error={!!addressToError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <KeyboardDatePicker
                                disableToolbar
                                disabled={true}
                                variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="Appointment date"
                                onChange={setSelectedTime}
                                value={selectedTime}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <KeyboardTimePicker
                                margin="normal"
                                id="time-picker"
                                label="Appointment Time"
                                ampm={false}
                                value={selectedTime}
                                onChange={setSelectedTime}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Create Order
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={openOrdersTable}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                    </MuiPickersUtilsProvider>


                </form>
            </div>
        </Container>
    );
}