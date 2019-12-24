import React, {useEffect} from 'react';
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
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import {makeGetCall, makePutCall} from "../utils/ajaxRequest";
import {getStatusCaption, getUserFullName} from "../utils/DataUtils";
import ContactSupportOutlined from '@material-ui/icons/ContactSupportOutlined'
import Avatar from '@material-ui/core/Avatar';
import {lightBlue, green} from '@material-ui/core/colors'
import {getFormattedDateFromISOString} from "../utils/DateTimeUtils";
import CheckOutlined from '@material-ui/icons/CheckOutlined';
import Fab from '@material-ui/core/Fab';

function createData(id, addressFrom, addressTo, appointmentTime, client, status) {
    return { id, addressFrom, addressTo, appointmentTime, client, status };
}

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
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

const headCells = [
    { id: 'addressFrom', numeric: false, disablePadding: true, label: 'Address From', sortable: true},
    { id: 'addressTo', numeric: false, disablePadding: false, label: 'Address To' },
    { id: 'appointmentTime', numeric: true, disablePadding: false, label: 'Appointment Time' },
    { id: 'client', numeric: true, disablePadding: false, label: 'Client', align: 'center' },
    { id: 'status', numeric: true, disablePadding: false, label: 'Status', align: 'center' },
    { id: 'actions', numeric: false, disablePadding: true, label: 'Actions', align: 'center'}
];

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={numSelected === rowCount && rowCount > 0}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell>
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
    }
}));

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected } = props;
    console.log(numSelected);

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
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle">
                    Orders
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton aria-label="filter list">
                        <FilterListIcon />
                    </IconButton>
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
    statusDiv: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'center',
        'min-height': '0px !important'
    },
    assignFab: {
        backgroundColor: green[600],
        color: '#fff'
    }
}));

export default function DriverOrdersTableCustomized(props) {
    console.log(props);
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('addressFrom');
    const [selected, setSelected] = React.useState(props.selected);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [dataRows, setDataRows] = React.useState(props.orders);
    const [performedAction, setPerformedAction] = React.useState('');

    const getOrdersUrl = props.statuses === 'opened' ?
        '/driver/openedOrders' : props.statuses === 'assigned' ?
            '/driver/assignedOrders' : props.statuses ==='closed' ? '/driver/completedOrders' : 'null';

    const handleRequestSort = (event, property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const updateSelected = (selected) => {
        setSelected(selected);
        if (props.selectedChangeHandler)
            props.selectedChangeHandler(selected);
    }

    const onOpenedOrdersLoaded = (response) => {
        const rows = response.map((row) => {

            return createData(row.order.id, row.order.addressFrom, row.order.addressTo, getFormattedDateFromISOString(row.order.appointmentDate),
                getUserFullName(row.order.client), getStatusCaption(row.status.titleKey));
        });
        setDataRows(rows);
        console.log(performedAction);
        if (props.changeOrdersHandler) {
            props.changeOrdersHandler(rows, performedAction);
        }
        setPerformedAction('');
    }

    useEffect(() => {
        if (!props.orders)
            makeGetCall(getOrdersUrl, onOpenedOrdersLoaded);

    }, []);

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = dataRows.map(n => n.addressFrom);
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


    const getEmptyRows = (rows) => {
        return rows ?
            rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage) :
            0;
    }

    const assignOrder = (event, orderId) => {
        event.preventDefault();
        event.stopPropagation();
        setPerformedAction('assign');
        makePutCall('/driver/assignOrderToMe/' + orderId, null, refreshOpenedOrders);
        console.log(orderId);
    }

    const refreshOpenedOrders = (response) => {
        makeGetCall(getOrdersUrl, onOpenedOrdersLoaded);
    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar numSelected={selected.length} />
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
                        />
                        <TableBody>
                            {stableSort(dataRows || [], getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.addressFrom);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={event => handleClick(event, row.addressFrom)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.addressFrom}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox" className={classes.tableCell}>
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none" className={classes.tableCell}>
                                                {row.addressFrom}
                                            </TableCell>
                                            <TableCell align="left" className={classes.tableCell}>{row.addressTo}</TableCell>
                                            <TableCell align="right" className={classes.tableCell}>{row.appointmentTime}</TableCell>
                                            <TableCell align="center" className={classes.tableCell}>{row.client}</TableCell>
                                            <TableCell align="center" className={classes.tableCell}>
                                                <Tooltip title="Opened">
                                                    <div className={classes.statusDiv}>
                                                        <Avatar className={classes.avatarBlue}><ContactSupportOutlined/></Avatar>
                                                    </div>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="center" className={classes.tableCell}>
                                                <Tooltip title="Assign To Me">
                                                    <div className={classes.statusDiv}>
                                                        <Fab size='small' className={classes.assignFab} onClick={(e) => assignOrder(e, row.id)}><CheckOutlined/></Fab>
                                                    </div>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {getEmptyRows(dataRows) > 0 && (
                                <TableRow style={{ height: (33) * getEmptyRows(dataRows) }}>
                                    <TableCell colSpan={6} />
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
        </div>
    );
}
