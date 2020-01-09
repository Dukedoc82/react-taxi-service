import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {makeGetCall} from "../utils/ajaxRequest";
import { green } from '@material-ui/core/colors';
import {getFormattedDateTimeFromISOString} from "../utils/DateTimeUtils";
import {getUserFullName, getStatusCaption} from "../utils/DataUtils";
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles(theme => ({
    table: {
        minWidth: 650,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: green[600],
    },
    addFab: {
        height: '3em',
        width: '3em'
    },
    tableHeader: {
        'font-weight': 'bold'
    }
}));

export default function DriverOrdersTable() {
    const classes = useStyles();
    const [dataRows, setDataRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            makeGetCall("/driver/openedOrders", onDataLoaded);
    }, []);

    const onDataLoaded = (response) => {
        setLoading(false);
        setDataRows(response);
    };

    return (
        <div>
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow >
                        <TableCell className={classes.tableHeader}>Address From</TableCell>
                        <TableCell className={classes.tableHeader}>Address To</TableCell>
                        <TableCell align="right" className={classes.tableHeader}>Appointment Time</TableCell>
                        <TableCell align="center" className={classes.tableHeader}>Client</TableCell>
                        <TableCell align="center" className={classes.tableHeader}>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataRows.map(row => (
                        <TableRow key={row.order.id}>
                            <TableCell component="th" scope="row">
                                {row.order.addressFrom}
                            </TableCell>
                            <TableCell>{row.order.addressTo}</TableCell>
                            <TableCell align="right">{getFormattedDateTimeFromISOString(row.order.appointmentDate)}</TableCell>
                            <TableCell align="center">{getUserFullName(row.order.client)}</TableCell>
                            <TableCell align="center">{getStatusCaption(row.status.titleKey)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
            {(loading)? <LinearProgress/> : ''}
        </div>
    );
}
