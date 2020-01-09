import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {makeGetCall, makePutCall} from "../utils/ajaxRequest";
import { green, red } from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';
import PostAddIcon from '@material-ui/icons/PostAdd';
import {getFormattedDateTimeFromISOString} from "../utils/DateTimeUtils";
import {getUserFullName, getStatusCaption} from "../utils/DataUtils";
import {Tooltip} from "@material-ui/core";
import AlertDialog from "../components/dialogs/AlertDialog";
import CreateOrderDialog from "./CreateOrderDialog";
import CssBaseline from "@material-ui/core/CssBaseline";
import OrderInfoButton from "../components/buttons/OrderInfoButton";
import RefuseButton from "../components/buttons/RefuseButton";
import OrderDetails from "./OrderDetails";

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
    },

    cancelFab: {
        backgroundColor: red[600],
        color: '#fff',
        boxShadow: 'none'
    },
    statusDiv: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 0),
        ...theme.mixins.toolbar,
        justifyContent: 'center',
        'min-height': '0px !important'
    },
    smallButton: {
        height: '24px',
        width: '24px',
        minWidth: '24px',
        minHeight: '24px'
    },
    clearIcon: {
        height: '20px',
        width: '20px'
    },
    buttonDiv: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

export default function SimpleTable() {
    const classes = useStyles();
    const [dataRows, setDataRows] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [stateStatus, setStateStatus] = useState('display');
    const [displayOrderDetailsId, setDisplayOrderDetailsId] = React.useState(null);

    const compare = (order1, order2) => {
        if (order1.status.titleKey === 'tp.status.completed' && order2.status.titleKey === 'tp.status.cancelled') {
            return 1;
        }
        if (order2.status.titleKey === 'tp.status.completed' && order1.status.titleKey === 'tp.status.cancelled') {
            return -1;
        }
        if (order1.status.titleKey === 'tp.status.completed' && order2.status.titleKey !== 'tp.status.completed') {
            return 1;
        }
        if (order2.status.titleKey === 'tp.status.completed' && order1.status.titleKey !== 'tp.status.completed') {
            return -1;
        }
        if (order1.status.titleKey === 'tp.status.cancelled' && order2.status.titleKey !== 'tp.status.cancelled') {
            return 1;
        }
        if (order2.status.titleKey === 'tp.status.cancelled' && order1.status.titleKey !== 'tp.status.cancelled') {
            return -1;
        } else {
            let date1 = new Date(order1.order.appointmentDate);
            let date2 = new Date(order2.order.appointmentDate);
            if (date1 > date2)
                return 1;
            else if (date2 > date1)
                return -1;
            else return 0;
        }
    };

    const onCancelSuccess = () => {
        makeGetCall("/order/", onDataLoaded);
    };

    const onCancelError = (response) => {
        setErrorMsg(response.message.replace('tp.status.cancelled', 'cancelled').replace('tp.status.completed', 'completed'));
    };

    const cancelOrder = (event, orderId) => {
        makePutCall("/order/cancel/" + orderId, null, onCancelSuccess, onCancelError);
    };

    const onDataLoaded = (response) => {
        setDataRows(response.sort(compare));
    };

    const showCreateOrderDialog = (event) => {
        event.preventDefault();
        setStateStatus('create');
    };

    const getOrderDetailsDialog = () => {
        return displayOrderDetailsId ? <OrderDetails open={true} onClose={() => setDisplayOrderDetailsId(null)} orderId={displayOrderDetailsId}/>
            : '';
    };

    const onOrderDetailsInfoClick = (event, orderId) => {
        event.preventDefault();
        event.stopPropagation();
        setDisplayOrderDetailsId(orderId);
    };

    const getActionView = (order) => {
        let status = order.status.titleKey;
        return !(status === 'tp.status.completed' || status === 'tp.status.cancelled') ?
            <div className={classes.buttonDiv}>
                <RefuseButton tooltip='Cancel Order' onClick={(e) => cancelOrder(e, order.order.id)}/>
                <OrderInfoButton onClick={(e) => onOrderDetailsInfoClick(e, order.order.id)}/>
            </div>
           : '';
    };

    const onAlertClose = () => {
        setErrorMsg('');
    };

    const getNewOrderDialog = () => {
        return stateStatus === 'create' ?
            (<CreateOrderDialog open={true} onCancel={handleModalClose} onCreate={onOrderCreate}/>)
            : '';
    };

    const handleModalClose = () => {
        setStateStatus('display');
    };

    const onOrderCreate = () => {
        setStateStatus('display');
        makeGetCall('/order/', onDataLoaded);
    };

    if (dataRows === null)
        makeGetCall("/order/", onDataLoaded);

    return (
        <div>
            <CssBaseline/>
            {getOrderDetailsDialog()}
            <div className={classes.drawerHeader}>
                <Fab color="primary" aria-label="add" className={classes.addFab} onClick={(e)=> showCreateOrderDialog(e)}>
                    <Tooltip title='Create new order'>
                    <PostAddIcon/>
                    </Tooltip>
                </Fab>
            </div>
            {dataRows !== null ? (
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow >
                                <TableCell className={classes.tableHeader}>Address From</TableCell>
                                <TableCell className={classes.tableHeader}>Address To</TableCell>
                                <TableCell align="right" className={classes.tableHeader}>Appointment Time</TableCell>
                                <TableCell align="center" className={classes.tableHeader}>Driver</TableCell>
                                <TableCell align="center" className={classes.tableHeader}>Status</TableCell>
                                <TableCell align="center" className={classes.tableHeader}>Actions</TableCell>
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
                                    <TableCell align="center">{getUserFullName(row.driver)}</TableCell>
                                    <TableCell align="center">{getStatusCaption(row.status.titleKey)}</TableCell>
                                    <TableCell align="center">{getActionView(row)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {getNewOrderDialog()}
                </TableContainer>
            ): <div> </div>}
            <AlertDialog open={!!errorMsg} handleClose={onAlertClose} message={errorMsg}/>
        </div>
    );
}
