import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import {makeGetCall, makePutCall} from "../utils/ajaxRequest";
import {getUserFullName} from "../utils/DataUtils";
import {lightBlue, green} from '@material-ui/core/colors'
import {getFormattedDateTimeFromISOString} from "../utils/DateTimeUtils";
import {CircularProgress} from "@material-ui/core";
import OrderInfoButton from "../components/buttons/OrderInfoButton";
import AssignButton from "../components/buttons/AssignButton";
import RefuseButton from "../components/buttons/RefuseButton";
import CompleteButton from "../components/buttons/CompleteButton";
import RefreshButton from "../components/buttons/RefreshButton";
import OrderDetails from "./OrderDetails";
import CssBaseline from "@material-ui/core/CssBaseline";
import EnhancedTableHead from "../components/table/EnhancedTableHead";

function createData(id, addressFrom, addressTo, appointmentTime, client, status) {
    return { id, addressFrom, addressTo, appointmentTime, client, status };
}

function desc(a, b, orderBy) {
    if (orderBy === 'appointmentTime') {
        let aDate = new Date(a[orderBy]);
        let bDate = new Date(b[orderBy]);
        if (bDate < aDate) {
            return -1;
        }
        if (bDate > aDate) {
            return 1;
        }
        return 0;
    } else {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1)
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
    tableHeader: {
        'font-weight': 'bold',
        'border-bottom': 'none'
    },
    statusCell: {
        width: '15%',
        display: 'flex',
        'flex-direction': 'row',
        'justify-content': 'center'
    },
    statusDiv: {
        display: 'flex',
        alignItems: 'center',
        padding: '0px 1px',
        ...theme.mixins.toolbar,
        justifyContent: 'center',
        'min-height': '0px !important'
    }
}));

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected, refreshOrders, selected, refuseOrders, assignOrders, completeOrders, forStatus } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1">
                    {numSelected} selected
                </Typography>
            ) : ''}

            {numSelected > 0 ? (
                forStatus === 'assigned' ? (<div className={classes.statusDiv}>
                    <RefuseButton tooltip='Refuse selected' onClick={(e) => refuseOrders(e, selected)}/>
                    <CompleteButton tooltip='Complete selected' onClick={(e) => completeOrders(e, selected)}/>
                    </div>) : (forStatus === 'opened' ?
                        (<AssignButton onClick={(e) => assignOrders(e, selected)} tooltip='Assign selected'/>
                        ): '')
            ) : (
                <RefreshButton tooltip='Refresh' onClick={refreshOrders}/>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
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
    tableHeader: {
        'font-weight': 'bold'
    },
    avatarBlue: {
        'backgroundColor': lightBlue[600]
    },
    avatarGreen: {
        'backgroundColor': green[600]
    },
    tableCell: {
        padding: '1em'
    },
    statusCell: {
        padding: '1em',
        width: '15%'
    },
    buttonDiv: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusDiv: {
        display: 'flex',
        alignItems: 'center',
        padding: '0px 1px',
        ...theme.mixins.toolbar,
        justifyContent: 'center',
        'min-height': '0px !important'
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'center',
    },
    hiddenDiv: {
        display: 'none'
    }
}));

export default function DriverOrdersTableCustomized(props) {
    const classes = useStyles();
    const {statuses, selectedChangeHandler, changeOrdersHandler } = props;
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('appointmentTime');
    const [selected, setSelected] = React.useState(props.selected);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [dataRows, setDataRows] = React.useState(props.orders);
    const [displayOrderDetailsId, setDisplayOrderDetailsId] = React.useState(null);
    const getOrdersUrl = statuses === 'opened' ?
        '/driver/openedOrders' : statuses === 'assigned' ?
            '/driver/assignedOrders' : statuses ==='closed' ? '/driver/completedOrders' : 'null';

    const headCells = statuses === 'closed' ? [
        { id: 'addressFrom', numeric: false, label: 'Address From'},
        { id: 'addressTo', numeric: false, disablePadding: false, label: 'Address To' },
        { id: 'appointmentTime', numeric: true, disablePadding: false, label: 'Appointment Time' },
        { id: 'client', numeric: true, disablePadding: false, label: 'Client', align: 'center' }
    ]: [
        { id: 'addressFrom', numeric: false, disablePadding: true, label: 'Address From', sortable: true},
        { id: 'addressTo', numeric: false, disablePadding: false, label: 'Address To' },
        { id: 'appointmentTime', numeric: true, disablePadding: false, label: 'Appointment Time', sortable: true },
        { id: 'client', numeric: true, disablePadding: false, label: 'Client', align: 'center' },
        { id: 'actions', numeric: false, disablePadding: true, label: 'Actions', align: 'center'}
    ];

    const handleRequestSort = (event, property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const updateSelected = (selected) => {
        setSelected(selected);
        if (selectedChangeHandler)
            selectedChangeHandler(selected);
    };

    const setPerformedAction = action => {
        performedAction = action;
    };

    const onOpenedOrdersLoaded = (response) => {
        const rows = response.map((row) => {

            return createData(row.order.id, row.order.addressFrom, row.order.addressTo, row.order.appointmentDate,
                getUserFullName(row.order.client));
        });
        setDataRows(rows);
        if (changeOrdersHandler) {
            changeOrdersHandler(rows, performedAction);
        }
        setSelected([]);
        setPerformedAction('');
    };

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = dataRows.map(n => n.id);
            updateSelected(newSelecteds);
            return;
        }
        updateSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        updateSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = name => selected.indexOf(name) !== -1;

    const getOrderDetailsDialog = () => {
        return displayOrderDetailsId ? <OrderDetails open={true} onClose={() => setDisplayOrderDetailsId(null)} orderId={displayOrderDetailsId}/>
        : '';
    };

    const onOrderDetailsInfoClick = (event, orderId) => {
        event.preventDefault();
        event.stopPropagation();
        setDisplayOrderDetailsId(orderId);
    };

    const getActionsCellValue = (rowId) => {
        if (statuses === 'opened')
            return (<TableCell align="center" className={classes.tableCell}>
                <div className={classes.buttonDiv}>
                <AssignButton onClick={(e) => assignOrder(e, rowId)} tooltip='Assign to Me'/>
                </div>
            </TableCell>);
        else if (statuses === 'assigned') {
            return (<TableCell align="center" className={classes.statusCell}>
                <div className={classes.buttonDiv}>
                    <RefuseButton tooltip='Refuse' onClick={(e) => refuseOrder(e, rowId)}/>
                    <CompleteButton tooltip='Complete' onClick={(e) => completeOrder(e, rowId)}/>
                    <OrderInfoButton onClick={(e) => onOrderDetailsInfoClick(e, rowId)}/>
                </div>
            </TableCell>);
        }
    };

    const getEmptyRows = (rows) => {
        return rows ?
            rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage) :
            0;
    };

    const assignOrder = (event, orderId) => {
        event.preventDefault();
        event.stopPropagation();
        setPerformedAction('assign');
        let ajax = {
            url: '/driver/assignOrderToMe/' + orderId,
            onSuccess: refreshOpenedOrders
        };
        makePutCall(ajax);
    };

    const refuseOrders = (event, orderIds) => {
        event.preventDefault();
        event.stopPropagation();
        setPerformedAction('refuse');
        let ajax = {
            url: '/driver/refuseOrders',
            body: orderIds,
            onSuccess: refreshOpenedOrders
        };
        makePutCall(ajax);
    };

    const assignOrders = (event, orderIds) => {
        event.preventDefault();
        event.stopPropagation();
        setPerformedAction('assign');
        let ajax = {
            url: '/driver/assignOrders',
            body: orderIds,
            onSuccess: refreshOpenedOrders
        };
        makePutCall(ajax);
    };

    const completeOrders = (event, orderIds) => {
        event.preventDefault();
        event.stopPropagation();
        setPerformedAction('assign');
        let ajax = {
            url: '/driver/completeOrders',
            body: orderIds,
            onSuccess: refreshOpenedOrders
        };
        makePutCall(ajax);
    };

    const refuseOrder = (event, orderId) => {
        event.preventDefault();
        event.stopPropagation();
        setPerformedAction('refuse');
        let ajax = {
            url: '/driver/refuseOrder/' + orderId,
            onSuccess: refreshOpenedOrders
        };
        makePutCall(ajax);
    };

    const completeOrder = (event, orderId) => {
        event.preventDefault();
        event.stopPropagation();
        setPerformedAction('complete');
        let ajax = {
            url: '/driver/completeOrder/' + orderId,
            onSuccess: refreshOpenedOrders()
        };
        makePutCall(ajax);
    };

    const refreshOpenedOrders = () => {
        let ajax = {
            url: getOrdersUrl,
            onSuccess: onOpenedOrdersLoaded
        };
        makeGetCall(ajax);
    };

    const getCheckboxCell = (classes, isItemSelected, labelId) => {
        return statuses !== 'closed' ? (<TableCell padding="checkbox" className={classes.tableCell}>
            <Checkbox
                checked={isItemSelected}
                inputProps={{ 'aria-labelledby': labelId }}
            />
        </TableCell>) : null;
    };

    let performedAction = '';

    if (dataRows == null) {
        let ajax = {
            url: getOrdersUrl,
            onSuccess: onOpenedOrdersLoaded
        };
        makeGetCall(ajax);
    }

    return (
        <div className={classes.root}>
            <CssBaseline/>
            {dataRows === null ?

                <div className={classes.drawerHeader}><CircularProgress/></div> :
                <Paper className={classes.paper}>
                    {getOrderDetailsDialog()}
                    <EnhancedTableToolbar numSelected={selected.length} refreshOrders={refreshOpenedOrders}
                                          selected={selected}
                                          refuseOrders={refuseOrders} forStatus={statuses} assignOrders={assignOrders}
                                          completeOrders={completeOrders}/>
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
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={dataRows ? dataRows.length : 0}
                                forStatus={statuses}
                            />
                            <TableBody>
                                {stableSort(dataRows || [], getSorting(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={event => handleClick(event, row.id)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}>
                                                {getCheckboxCell(classes, isItemSelected, labelId)}
                                                <TableCell component="th" id={labelId} scope="row"
                                                           className={classes.tableCell}>
                                                    {row.addressFrom}
                                                </TableCell>
                                                <TableCell align="left"
                                                           className={classes.tableCell}>{row.addressTo}</TableCell>
                                                <TableCell align="right"
                                                           className={classes.tableCell}>{getFormattedDateTimeFromISOString(row.appointmentTime)}</TableCell>
                                                <TableCell align="center"
                                                           className={classes.tableCell}>{row.client}</TableCell>
                                                {getActionsCellValue(row.id)}
                                            </TableRow>
                                        );
                                    })}
                                {getEmptyRows(dataRows) > 0 && (
                                    <TableRow style={{height: (33) * getEmptyRows(dataRows)}}>
                                        <TableCell colSpan={6}/>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={(dataRows || []).length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>

            }
        </div>
    );
};

DriverOrdersTableCustomized.propTypes = {
    statuses: PropTypes.any.isRequired,
    orders: PropTypes.arrayOf(PropTypes.object),
    selectedChangeHandler: PropTypes.func,
    changeOrdersHandler: PropTypes.func
};
