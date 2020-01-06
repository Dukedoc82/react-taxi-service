import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import {makeGetCall, makePutCall} from "../utils/ajaxRequest";
import {byClasses, getUserFullName} from "../utils/DataUtils";
import {lightBlue, green, red, blue} from '@material-ui/core/colors'
import {getFormattedDateFromISOString} from "../utils/DateTimeUtils";
import CheckOutlined from '@material-ui/icons/CheckOutlined';
import Fab from '@material-ui/core/Fab';
import RefreshOutlined from '@material-ui/icons/RefreshOutlined'
import {CircularProgress} from "@material-ui/core";
import OrderInfoButton from "../components/buttons/OrderInfoButton";
import AssignButton from "../components/buttons/AssignButton";
import RefuseButton from "../components/buttons/RefuseButton";

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

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, forStatus } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };
    const headCells = forStatus === 'closed' ? [
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

    const getCheckboxCell = (numSelected, rowCount, onSelectAllClick) => {
        return forStatus !== 'closed' ? (<TableCell padding="checkbox">
            <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={numSelected === rowCount && rowCount > 0}
                onChange={onSelectAllClick}
                inputProps={{ 'aria-label': 'select all desserts' }}
            />
        </TableCell>) : null;
    };

    return (
        <TableHead>
            <TableRow>
                {getCheckboxCell(numSelected, rowCount, onSelectAllClick)}
                {headCells.map(headCell => (
                    <TableCell  className={classes.tableHeader}
                        key={headCell.id}
                        align={headCell.align ? headCell.align : (headCell.numeric ? 'right' : 'left')}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {!!headCell.sortable ? (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={order}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                                ) : null}
                            </TableSortLabel>
                        ) : (
                            <span>
                                {headCell.label}
                            </span>
                        )}

                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

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
    smallButton: {
        height: '30px',
        width: '30px',
        minWidth: '30px',
        minHeight: '30px'
    },
    fabButton: {
        color: '#fff',
        boxShadow: 'none',
        margin: '0.25em'
    },
    refreshButton: {
        backgroundColor: blue[600],
    },
    cancelFab: {
        backgroundColor: red[600],
    },
    assignFab: {
        backgroundColor: green[600],
        color: '#fff'
    },
    statusDiv: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
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
                    <Tooltip title="Complete selected">
                    <Fab className={byClasses([classes.fabButton, classes.assignFab, classes.smallButton])}
                         onClick={(e) => completeOrders(e, selected)}>
                        <CheckOutlined />
                    </Fab>
                </Tooltip></div>) : (forStatus === 'opened' ?
                        (<AssignButton onClick={(e) => assignOrders(e, selected)} tooltip='Assign selected'/>
                        ): '')
            ) : (
                <Tooltip title="Refresh">
                    <Fab className={byClasses([classes.fabButton, classes.refreshButton, classes.smallButton])}
                         onClick={refreshOrders}>
                        <RefreshOutlined/>
                    </Fab>
                </Tooltip>
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
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'center',
        'min-height': '0px !important'
    },
    smallButton: {
        height: '30px',
        width: '30px',
        minWidth: '30px',
        minHeight: '30px'
    },
    assignFab: {
        backgroundColor: green[600],
        color: '#fff'
    },
    cancelFab: {
        backgroundColor: red[600],
        color: '#fff'
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
    const getOrdersUrl = statuses === 'opened' ?
        '/driver/openedOrders' : statuses === 'assigned' ?
            '/driver/assignedOrders' : statuses ==='closed' ? '/driver/completedOrders' : 'null';

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

    const getActionsCellValue = (rowId) => {
        if (statuses === 'opened')
            return (<TableCell align="center" className={classes.tableCell}>
                <div className={classes.buttonDiv}>
                <AssignButton onClick={(e) => assignOrder(e, rowId)} tooltip='Assign to Me'/>
                <OrderInfoButton/>
                </div>
            </TableCell>);
        else if (statuses === 'assigned') {
            return (<TableCell align="center" className={classes.statusCell}>
                <div className={classes.buttonDiv}>
                    <RefuseButton tooltip='Refuse' onClick={(e) => refuseOrder(e, rowId)}/>
                    <Tooltip title="Complete">
                        <div className={classes.statusDiv}>
                            <Fab size='small' className={classes.assignFab + ' ' + classes.smallButton} onClick={(e) => completeOrder(e, rowId)}><CheckOutlined/></Fab>
                        </div>
                    </Tooltip>
                </div>
            </TableCell>)

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
        makePutCall('/driver/assignOrderToMe/' + orderId, null, refreshOpenedOrders);
    };

    const refuseOrders = (event, orderIds) => {
        event.preventDefault();
        event.stopPropagation();
        setPerformedAction('refuse');
        makePutCall('/driver/refuseOrders', orderIds, refreshOpenedOrders);
    };

    const assignOrders = (event, orderIds) => {
        event.preventDefault();
        event.stopPropagation();
        setPerformedAction('assign');
        makePutCall('/driver/assignOrders', orderIds, refreshOpenedOrders);
    };

    const completeOrders = (event, orderIds) => {
        event.preventDefault();
        event.stopPropagation();
        setPerformedAction('assign');
        makePutCall('/driver/completeOrders', orderIds, refreshOpenedOrders);
    };

    const refuseOrder = (event, orderId) => {
        event.preventDefault();
        event.stopPropagation();
        setPerformedAction('refuse');
        makePutCall('/driver/refuseOrder/' + orderId, null, refreshOpenedOrders)
    };

    const completeOrder = (event, orderId) => {
        event.preventDefault();
        event.stopPropagation();
        setPerformedAction('complete');
        makePutCall('/driver/completeOrder/' + orderId, null, refreshOpenedOrders)
    };

    const refreshOpenedOrders = () => {
        makeGetCall(getOrdersUrl, onOpenedOrdersLoaded);
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
        makeGetCall(getOrdersUrl, onOpenedOrdersLoaded);
    }

    return (
        <div className={classes.root}>
            {dataRows === null ?

                <div className={classes.drawerHeader}><CircularProgress/></div> :
                <Paper className={classes.paper}>
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
                                                           className={classes.tableCell}>{getFormattedDateFromISOString(row.appointmentTime)}</TableCell>
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
