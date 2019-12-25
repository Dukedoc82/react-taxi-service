import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom'
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
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CreateNewOrder from './CreateNewOrder'
import {getFormattedDateFromISOString} from "../utils/DateTimeUtils";
import {getUserFullName, getStatusCaption} from "../utils/DataUtils";

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

export default function SimpleTable() {
    const classes = useStyles();
    const [dataRows, setDataRows] = useState([]);

    useEffect(() => {

            makeGetCall("/order/", onDataLoaded);

    }, []);

    const onDataLoaded = (response) => {
        setDataRows(response);

    };

    const showCreateOrderDialog = (event) => {
        event.preventDefault();
        ReactDOM.render(<CreateNewOrder/>, document.getElementById('mainContent'));
    };

    return (
        <div>
            <div className={classes.drawerHeader}>
                <Fab color="primary" aria-label="add" className={classes.addFab} onClick={(e)=> showCreateOrderDialog(e)}>
                    <AddIcon />
                </Fab>
            </div>
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow >
                        <TableCell className={classes.tableHeader}>Address From</TableCell>
                        <TableCell className={classes.tableHeader}>Address To</TableCell>
                        <TableCell align="right" className={classes.tableHeader}>Appointment Time</TableCell>
                        <TableCell align="center" className={classes.tableHeader}>Driver</TableCell>
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
                            <TableCell align="right">{getFormattedDateFromISOString(row.order.appointmentDate)}</TableCell>
                            <TableCell align="center">{getUserFullName(row.driver)}</TableCell>
                            <TableCell align="center">{getStatusCaption(row.status.titleKey)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </div>
    );
}
