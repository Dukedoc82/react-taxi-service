import React from "react";
import {makeGetCall, makePutCall} from "../utils/ajaxRequest";
import {makeStyles, Tooltip} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import CssBaseline from "@material-ui/core/CssBaseline";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import EnhancedTableHead from "../components/table/EnhancedTableHead";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import {getSorting, stableSort} from "../utils/SortingUtils";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {getFormattedDateTimeFromISOString} from "../utils/DateTimeUtils";
import {getStatusCaption, getStatusTitleByKey, getUserFullName} from "../utils/DataUtils";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Fab from "@material-ui/core/Fab";
import Icon from "@mdi/react";
import {mdiContentSave, mdiClose} from "@mdi/js";
import {blue, red} from "@material-ui/core/colors";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from '@material-ui/core/FormControl';
import BlockUi from "react-block-ui";

const mapDataRow = (map, obj) => {
    map[obj.id] = {
        driver: obj.driver,
        status: obj.status
    };
    return map;
};

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    tableHeader: {
        'font-weight': 'bold'
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    select: {
        width: '100%',
        padding: '0.25em',
        '& div': {
            padding: '0.25em'
        },
        fontSize: '0.875rem',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        lineHeight: 1.43,
        letterSpacing: '0.01071em'
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    cancelFab: {
        backgroundColor: blue[600],
    },
    rejectFab: {
        backgroundColor: red[600],
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
        height: '36px',
        width: '36px',
        minWidth: '36px',
        minHeight: '36px'
    },
    fabButton: {
        color: '#fff',
        boxShadow: 'none',
        margin: '0.25em'
    }
}));

const headCells = [
    { id: 'addressFrom', numeric: false, disablePadding: false, label: 'Address From', sortable: true},
    { id: 'addressTo', numeric: false, disablePadding: false, label: 'Address To' },
    { id: 'appointmentTime', numeric: true, disablePadding: false, label: 'Appointment Time', sortable: true },
    { id: 'client', numeric: false, disablePadding: false, label: 'Client', align: 'center' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status', align: 'center', sortable: true },
    { id: 'driver', numeric: false, disablePadding: false, label: 'Driver', align: 'center' }
];

export default function AdminOrdersTable() {
    const classes = useStyles();
    const [drivers, setDrivers] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [changedOrders, setChangedOrders] = React.useState(null);
    const [statuses, setStatuses] = React.useState(null);
    const [order, setOrder] = React.useState('asc');
    const [dataRows, setDataRows] = React.useState(null);
    const [updateReqSent, setUpdateReqSent] = React.useState(false);
    const [orderBy, setOrderBy] = React.useState('appointmentTime');
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);
    const [driverErrorMsg, setDriverErrorMsg] = React.useState([]);
    const [ordersMap, setOrdersMap] = React.useState({});

    let driversLoaded = false;
    let statusesLoaded = false;

    const isInitialDataLoaded = () => {
        return driversLoaded && statusesLoaded;
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRequestSort = (event, property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const onOrdersLoaded = (response) => {
        const ordersData = response.map(row => {
            const {order, driver} = row;
            return {
                id: order.id,
                addressFrom: order.addressFrom,
                addressTo: order.addressTo,
                appointmentTime: order.appointmentDate,
                client: order.client,
                status: row.orderStatus,
                driver: driver
            }
        });
        setDataRows(ordersData);
        setOrdersMap(ordersData.reduce(mapDataRow, {}));
        setIsLoading(false);
    };

    const onDriversLoaded = (response) => {
        driversLoaded = true;
        setDrivers(response);
        setTimeout(loadOrders, 100);
    };

    const getDrivers = () => {
        let ajax = {
            url: '/admin/driver/',
            onSuccess: onDriversLoaded
        };
        makeGetCall(ajax);
    };

    const loadOrders = () => {
        if (isInitialDataLoaded()) {
            setChangedOrders(null);
            let ajax = {
                url: '/admin/order',
                onSuccess: onOrdersLoaded
            };
            makeGetCall(ajax);
        }
    };

    const onStatusesLoaded = (response) => {
        statusesLoaded = true;
        setStatuses(response);
        setTimeout(loadOrders, 100);
    };

    const getStatuses = () => {
        let ajax = {
            url: '/orderStatus/',
            onSuccess: onStatusesLoaded
        };
        makeGetCall(ajax);
    };

    const getDriverById = (driverId) => {
        return drivers.filter(driver => {
            return driver.userId === driverId;
        })[0];
    };

    const getStatusById = (statusId) => {
        return statuses.filter(status => {
            return status.id === statusId;
        })[0];
    };

    const getDriversMenuList = () => {
        return drivers ? drivers.map(item => {
            return (<MenuItem key={item.userId} value={item.userId} name={getUserFullName(item)}>{getUserFullName(item)}</MenuItem>);
        }) : '';
    };

    const getStatusesMenuList = () => {
        return statuses ? statuses.map(item => {
            return (<MenuItem key={item.id} value={item.id}>
                <div className={classes.centered}>
                        {getStatusCaption(item.titleKey)} {getStatusTitleByKey(item.titleKey)}
                </div></MenuItem>);
        }) : '';
    };

    const assignOrderToDriver = (orderId, driver) => {
        let tempMap = Object.assign({}, ordersMap);
        tempMap[orderId].driver = driver;
        setOrdersMap(tempMap);
    };

    const validateData = (orderId) => {
        let orderRec = ordersMap[orderId];
        if (orderRec) {
            let status = orderRec.status;
            let driver = orderRec.driver;
            if (status && (status.titleKey === 'tp.status.assigned' || status.titleKey === 'tp.status.completed') && driver === null) {
                let driverErrorMsgMap = Object.assign({}, driverErrorMsg);
                driverErrorMsgMap[orderId] = 'Select a Driver';
                setDriverErrorMsg(driverErrorMsgMap);
            } else {
                if (driverErrorMsg[orderId]) {
                    let driverErrorMsgMap = Object.assign({}, driverErrorMsg);
                    delete driverErrorMsgMap[orderId];
                    setDriverErrorMsg(driverErrorMsgMap);
                }
            }
        }
    };

    const isError = (orderId) => {
        return !!driverErrorMsg[orderId];
    };

    const hasErrors = () => {
        for (let prop in driverErrorMsg) {
            return true;
        }
        return false;
    };

    const onDriverSelect = (event, orderId) => {
        event.stopPropagation();
        let driver = getDriverById(event.target.value);
        let currentStatus = ordersMap[orderId].status;
        if (driver) {
            assignOrderToDriver(orderId, driver);
            let tmpChangedOrders = changedOrders ? Object.assign({}, changedOrders) : [];
            if (!tmpChangedOrders[orderId]) {
                tmpChangedOrders[orderId] = {id: orderId, driver: driver, status: currentStatus};
            } else {
                tmpChangedOrders[orderId].driver = driver;
            }
            setChangedOrders(tmpChangedOrders);
        }
        validateData(orderId);
    };

    const onStatusSelect = (event, orderId) => {
        event.stopPropagation();
        let status = getStatusById(event.target.value);
        if (status) {
            let tempMap = Object.assign({}, ordersMap);
            tempMap[orderId].status = status;
            setOrdersMap(tempMap);
            let tmpChangedOrders = changedOrders ? Object.assign({}, changedOrders) : [];
            if (!tmpChangedOrders[orderId]) {
                tmpChangedOrders[orderId] = {id: orderId, status: status};
            } else {
                tmpChangedOrders[orderId].status = status;
            }
            setChangedOrders(tmpChangedOrders);
        }
        validateData(orderId);
    };

    const saveChanges = () => {
        setIsLoading(true);
        let body = [];
        for (let prop in changedOrders) {
            let order = changedOrders[prop];

            body.push({id: order.id, statusId: order.status.id, driverId: order.driver ? order.driver.userId : null});
        }
        let ajax = {
            url: '/admin/updateOrders',
            body: body,
            onSuccess: loadOrders
        };
        driversLoaded = true;
        statusesLoaded = true;
        makePutCall(ajax);
    };

    const rejectChanges = () => {
        setChangedOrders([]);
        setOrdersMap(dataRows.reduce(mapDataRow, {}));
        setDriverErrorMsg({});
    };

    const renderValue = (selected, currentDriver) => {
        let driver = getDriverById(selected);
        let driverName = driver ? getUserFullName(driver) : getUserFullName(currentDriver);
        return <div>
            {driverName}
        </div>
    };

    const getFormHelperText = (orderId) => {
        return driverErrorMsg[orderId] ?
            <FormHelperText>{driverErrorMsg[orderId]}</FormHelperText>: '';
    };

    if (drivers == null && !updateReqSent) {
        setUpdateReqSent(true);
        getDrivers();
        getStatuses();
    }

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <BlockUi tag="div" blocking={isLoading}>
            <Paper className={classes.paper}>
                <div className={classes.drawerHeader}>
                    <Tooltip title="Save changes" >
                        <div className={classes.statusDiv}>
                            <Fab size='small' className={classes.cancelFab + ' ' + classes.smallButton + ' ' + classes.fabButton}
                                 onClick={()=>saveChanges()} disabled={changedOrders === null || changedOrders.length === 0 || hasErrors()}>
                                <Icon path={mdiContentSave} size={1} color={'#fff'}/>
                            </Fab>
                        </div>
                    </Tooltip>
                    <Tooltip title="Reject changes" >
                        <div className={classes.statusDiv}>
                            <Fab size='small' className={classes.rejectFab + ' ' + classes.smallButton + ' ' + classes.fabButton}
                                 onClick={()=>rejectChanges()} disabled={changedOrders === null || changedOrders.length === 0}>
                                <Icon path={mdiClose} size={1} color={'#fff'}/>
                            </Fab>
                        </div>
                    </Tooltip>
                </div>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            headCells={headCells}
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={dataRows ? dataRows.length : 0}
                        />
                        <TableBody>
                            {stableSort(dataRows || [], getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    const selectId = `driver-select-${index}`;
                                    const statusSelectId = `status-select-${index}`;

                                    return (
                                        <TableRow
                                            tabIndex={-1}
                                            key={row.id}>
                                            <TableCell component="th" id={labelId} scope="row"
                                                       className={classes.tableCell}>
                                                {row.addressFrom}
                                            </TableCell>
                                            <TableCell align="left"
                                                       className={classes.tableCell}>{row.addressTo}</TableCell>
                                            <TableCell align="right"
                                                       className={classes.tableCell}>{getFormattedDateTimeFromISOString(row.appointmentTime)}</TableCell>
                                            <TableCell align="center"
                                                       className={classes.tableCell}>{getUserFullName(row.client)}</TableCell>
                                            <TableCell align="center" className={classes.tableCell}>
                                                <Select id={statusSelectId} autoWidth={true}
                                                        value={ordersMap[row.id] && ordersMap[row.id].status ? ordersMap[row.id].status.id : ''}
                                                        onChange={(e) => onStatusSelect(e, row.id)}
                                                        variant="outlined" className={classes.select}>
                                                    {getStatusesMenuList()}
                                                </Select>
                                            </TableCell>
                                            <TableCell align="center" className={classes.tableCell}>
                                                <FormControl error={isError(row.id)} className={classes.root}>
                                                    <Select id={selectId}
                                                            value={ordersMap[row.id] && ordersMap[row.id].driver ? ordersMap[row.id].driver.userId : ''}
                                                            onChange={(e) => onDriverSelect(e, row.id)}
                                                            variant="outlined" className={classes.select} renderValue={(selected) => renderValue(selected, ordersMap[row.id].driver)}>
                                                        {getDriversMenuList()}
                                                    </Select>
                                                    {getFormHelperText(row.id)}
                                                </FormControl>
                                            </TableCell>

                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    component="div"
                    count={(dataRows || []).length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            </BlockUi>
        </div>
    );
}