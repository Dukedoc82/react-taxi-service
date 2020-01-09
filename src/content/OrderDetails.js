import React, {useEffect, useState} from 'react';
import Grid from "@material-ui/core/Grid";
import {Dialog} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import PropTypes from 'prop-types';
import CssBaseline from "@material-ui/core/CssBaseline";
import style from '../utils/classes'
import {makeGetCall} from "../utils/ajaxRequest";
import {getUserFullName} from "../utils/DataUtils";
import {formatDate, formatTime} from "../utils/DateTimeUtils";

export default function OrderDetails(props) {
    const classes = style();
    const {open, onClose, orderId} = props;

    const [content, setContent] = useState('');

    const onDialogLoad = (response) => {
        setContent(
            <DialogContent>
                <Grid container spacing={2} className={classes.orderInfoGrid}>
                    <Grid item xs={12}>
                    </Grid>
                    <Grid item xs={5} className={classes.boldText}>
                        <div>Address From:</div>
                    </Grid>
                    <Grid item xs={7}>
                        {response.order.addressFrom}
                    </Grid>
                    <Grid item xs={5} className={classes.boldText}>
                        <div>Address To:</div>
                    </Grid>
                    <Grid item xs={7}>
                        {response.order.addressTo}
                    </Grid>
                    <Grid item xs={5} className={classes.boldText}>
                        <div>Appointment Time:</div>
                    </Grid>
                    <Grid item xs={7}>
                        {formatDate(new Date(response.order.appointmentDate))} <i>{formatTime(new Date(response.order.appointmentDate))}</i>
                    </Grid>
                    <Grid item xs={5} className={classes.boldText}>
                        <div>Client:</div>
                    </Grid>
                    <Grid item xs={7}>
                        {getUserFullName(response.order.client)}
                    </Grid>
                    <Grid item xs={5} className={classes.boldText}>
                        <div>Client phone:</div>
                    </Grid>
                    <Grid item xs={7}>
                        {response.order.client.phoneNumber}
                    </Grid>
                </Grid>
            </DialogContent>
        )
    };

    useEffect(() => {
        makeGetCall('/order/' + orderId, onDialogLoad);
    }, []);

    return (
        <Dialog open={open} className={classes.orderInfoDialog} classes={{
            container: classes.orderInfoDialogContent
        }}>
            <CssBaseline/>
            {content}
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

OrderDetails.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    orderId: PropTypes.number.isRequired
};