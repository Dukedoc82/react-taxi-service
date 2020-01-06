import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import React from "react";

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };
    const headCells = [
        { id: 'client', numeric: true, disablePadding: false, label: 'Client', sortable: true},
        { id: 'addressFrom', numeric: false, label: 'Address From', sortable: true},
        { id: 'addressTo', numeric: false, disablePadding: false, label: 'Address To', sortable: true},
        { id: 'appointmentTime', numeric: true, disablePadding: false, label: 'Appointment Time', sortable: true},
        { id: 'driver', numeric: true, disablePadding: false, label: 'Client', align: 'center', sortable: true},
        { id: 'status', numeric: false, disablePadding: false, label: 'Status', sortable: true},
        { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }
    ];

    const getCheckboxCell = (numSelected, rowCount, onSelectAllClick) => {
        return (<TableCell padding="checkbox">
            <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={numSelected === rowCount && rowCount > 0}
                onChange={onSelectAllClick}
                inputProps={{ 'aria-label': 'select all desserts' }}
            />
        </TableCell>);
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