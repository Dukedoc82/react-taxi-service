import React, {useState} from 'react';
import {makeGetCall, makePutCall} from "../utils/ajaxRequest";
import CssBaseline from "@material-ui/core/CssBaseline";
import {makeStyles, TableContainer, Tooltip} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import Paper from '@material-ui/core/Paper';
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Checkbox from "@material-ui/core/Checkbox";
import Fab from "@material-ui/core/Fab";
import {mdiContentSave} from '@mdi/js';
import Icon from "@mdi/react";
import {blue} from '@material-ui/core/colors';
import BlockUi from "react-block-ui";

const assignOrderNotificationsTitle = "Receive Assign Order Notifications";
const assignOrderNotificationsDesc = "Notification is sent to the client and the driver who assigned the order";
const newOrderNotificationsTitle = "Receive New Order Notifications";
const newOrderNotificationsDesc = "Notification is sent to the client and all drivers";
const cancelOrderNotificationsTitle = "Receive Cancel Order Notifications";
const cancelOrderNotificationsDesc = "Notification is sent to the client and the driver assigned to the order";
const completeOrderNotificationsTitle = "Receive Complete Order Notifications";
const completeOrderNotificationsDesc = "Notification is sent to the client and the driver who completed the order";
const refuseOrderNotificationsTitle = "Receive Refuse Order Notifications";
const refuseOrderNotificationsDesc = "Notification is sent to the client and all drivers";

const createDataRow = (id, name, header, description, value) => {
    return {
        id: id,
        name: name,
        header: header,
        description: description,
        value: value
    };
};

const useStyles = makeStyles(theme => ({
    table: {
        minWidth: 650,
    },
    tableHeader: {
        'font-weight': 'bold'
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    smallButton: {
        height: '36px',
        width: '36px',
        minWidth: '36px',
        minHeight: '36px'
    },
    fabButton: {
        color: '#fff',
        boxShadow: 'none',
        margin: '0.25em'
    },
    cancelFab: {
        backgroundColor: blue[600],
    },
    statusDiv: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 0),
        ...theme.mixins.toolbar,
        justifyContent: 'center',
        'min-height': '0px !important'
    }
}));

export default function SettingsPage() {
    const classes = useStyles();

    const [changed, setChanged] = useState(false);
    const [loading, setLoading] = useState(true);

    const [state, setState] = useState({
       newOrderNotifications: true,
       cancelOrderNotifications: true,
       completeOrderNotifications: true,
       refuseOrderNotifications: true,
       assignOrderNotifications:  true
    });

    const [dataRows, setDataRows] = useState(null);

    const onDataLoaded = (response) => {
        setLoading(false);
        setChanged(false);
        const {getNewOrderNotifications, getCancelOrderNotifications, getCompleteOrderNotifications,
            getRefuseOrderNotifications, getAssignOrderNotifications} = response;
        setState({...state, newOrderNotifications: getNewOrderNotifications});
        setState({...state, cancelOrderNotifications: getCancelOrderNotifications});
        setState({...state, completeOrderNotifications: getCompleteOrderNotifications});
        setState({...state, refuseOrderNotifications: getRefuseOrderNotifications});
        setState({...state, assignOrderNotifications: getAssignOrderNotifications});
        let rows = [];
        rows.push(createDataRow(1, 'newOrderNotifications', newOrderNotificationsTitle, newOrderNotificationsDesc, getNewOrderNotifications));
        rows.push(createDataRow(2, 'cancelOrderNotifications', cancelOrderNotificationsTitle, cancelOrderNotificationsDesc, getCancelOrderNotifications));
        rows.push(createDataRow(3, 'completeOrderNotifications', completeOrderNotificationsTitle, completeOrderNotificationsDesc, getCompleteOrderNotifications));
        rows.push(createDataRow(4, 'refuseOrderNotifications', refuseOrderNotificationsTitle, refuseOrderNotificationsDesc, getRefuseOrderNotifications));
        rows.push(createDataRow(5, 'assignOrderNotifications', assignOrderNotificationsTitle, assignOrderNotificationsDesc, getAssignOrderNotifications));
        setDataRows(rows);
    };

    const handleChange = (name, event) => {
        setState({...state, [name]: event.target.value});
        let row = dataRows.filter(dataRow => {
            return dataRow.name === name;
        })[0];
        row.value = !row.value;
        setChanged(true);
    };

    if (dataRows === null) {
        let ajax = {
            url: '/mailSettings/',
            onSuccess: onDataLoaded
        };
        makeGetCall(ajax);
    }

    const saveChanges = () => {
        setLoading(true);
        let ajax = {
            url: '/mailSettings/update',
            body: {
                getNewOrderNotifications: getDataRowByName('newOrderNotifications').value,
                getCancelOrderNotifications: getDataRowByName('cancelOrderNotifications').value,
                getCompleteOrderNotifications: getDataRowByName('completeOrderNotifications').value,
                getRefuseOrderNotifications: getDataRowByName('refuseOrderNotifications').value,
                getAssignOrderNotifications: getDataRowByName('assignOrderNotifications').value
            },
            onSuccess: onDataLoaded
        };
        makePutCall(ajax);
    };

    const getDataRowByName = (name) => {
        return dataRows.filter(row => {
            return row.name === name;
        })[0];
    };

    return (
        <div>
            <CssBaseline/>
            <BlockUi tag="div" blocking={loading}>
            <div className={classes.drawerHeader}>
                <Tooltip title="Save changes" >
                    <div className={classes.statusDiv}>
                        <Fab size='small' className={classes.cancelFab + ' ' + classes.smallButton + ' ' + classes.fabButton}
                             onClick={()=>saveChanges()} disabled={!changed}>
                            <Icon path={mdiContentSave} size={1} color={'#fff'}/>
                        </Fab>
                    </div>
                </Tooltip>
            </div>
            {dataRows !== null ? (
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <colgroup>
                            <col width="25%"/>
                            <col width="60%"/>
                            <col width="15%"/>
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.tableHeader}>Name</TableCell>
                                <TableCell className={classes.tableHeader}>Description</TableCell>
                                <TableCell align='center' className={classes.tableHeader}>Receive Notifications</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataRows.map(row => (
                                <TableRow key={row.id}>
                                    <TableCell component='th' scope='row'>
                                        {row.header}
                                    </TableCell>
                                    <TableCell component='th' scope='row'>
                                        {row.description}
                                    </TableCell>
                                    <TableCell align='center' component='th' scope='row'>
                                        <Checkbox checked={row.value} onChange={(e) => handleChange(row.name, e)} value={row.value}/>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : <div> </div>}
            </BlockUi>
        </div>
    )

};