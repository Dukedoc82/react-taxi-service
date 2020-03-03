import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {PropTypes} from "prop-types";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core/styles';
import {green} from "@material-ui/core/colors";
import Avatar from "@material-ui/core/Avatar";
import PostAddIcon from '@material-ui/icons/PostAdd';
import Typography from "@material-ui/core/Typography";
import ConfirmDialog from "../components/dialogs/ConfirmDialog";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import {makePostCall} from "../utils/ajaxRequest";
import {validateIsNotEmpty} from "../utils/ValidationUtils";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';

const useStyles = makeStyles(theme => ({
    dialogRoot: {
        maxWidth: '100%',
        width: '60%',
        left: '35%'
    },
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
    },
    container: {
        backgroundColor: '#fff',
        paddingTop: '1em',
        position: 'absolute',
        top: '5%',
        left: '35%',
        paddingBottom: '1em'
    }
}));

export default function CreateOrderDialog(props) {
    const {open, onCancel, onCreate} = props;

    const ADDRESS_FROM_ERR_MSG = 'Specify the address where you\'re going from.';
    const ADDRESS_TO_ERR_MSG = 'Specify the address where you\'re going to.';

    const currentTime = new Date();

    const [addressFrom, setAddressFrom] = useState('');
    const [addressTo, setAddressTo] = useState('');
    const [selectedTime, setSelectedTime] =
        useState(new Date(2020, 2, 8, currentTime.getHours(), currentTime.getMinutes()));
    const [addressFromError, setAddressFromError] = useState('');
    const [addressToError, setAddressToError] = useState('');
    const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
    const [blocking, setBlocking] = useState(false);

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

    const onSuccessCreate = () => {
        setBlocking(false);
        onCreate();
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

    const onCreateError = () => {
        setBlocking(false);
    };

    const onSubmit = (event) => {
        event.preventDefault();
        setBlocking(true);
        if (validateForm()) {
            let ajax = {
                url: '/order/new',
                body: {
                    addressFrom: addressFrom,
                    addressTo: addressTo,
                    appointmentDate: selectedTime.toISOString()
                },
                onSuccess: onSuccessCreate,
                onError: onCreateError
            };
            makePostCall(ajax);
        }
    };

    const openOrdersTable = (event) => {
        setConfirmDialogMessage('');
        event.preventDefault();
        onCancel();
    };

    const validateForm = () => {
        let addrFromIsNotEmpty = validateIsNotEmpty(addressFrom, onCorrectAddressFrom, onInvalidAddressFrom);
        let addrToIsNotEmpty = validateIsNotEmpty(addressTo, onCorrectAddressTo, onInvalidAddressTo);
        return addrFromIsNotEmpty && addrToIsNotEmpty;
    };

    const onEscape = () => {
        if (!blocking) {
            setConfirmDialogMessage('In this case you will lose your changes.');
        }
    };

    const classes = useStyles();

    return (
        <div>
            <Dialog open={open} aria-labelledby="form-dialog-title" onEscapeKeyDown={onEscape}>
                <BlockUi tag="div" blocking={blocking}>
                <DialogContent>
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <PostAddIcon/>
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
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                className={classes.submit}
                                                onClick={() => setConfirmDialogMessage('In this case you will lose your changes.')}
                                            >
                                                Cancel
                                            </Button>
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
                                    </Grid>
                                </MuiPickersUtilsProvider>
                                <ConfirmDialog open={!!confirmDialogMessage} okHandler={openOrdersTable}
                                               title={'Cancel new order creation?'}  message={confirmDialogMessage}
                                               cancelHandler={() => {setConfirmDialogMessage('')}} okText='Yes' cancelText='No'/>
                            </form>
                        </div>

                </DialogContent>
                </BlockUi>

            </Dialog>

        </div>
    );
}

CreateOrderDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onCreate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};
