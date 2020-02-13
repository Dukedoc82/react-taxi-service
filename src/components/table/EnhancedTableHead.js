import React from 'react';
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import PropTypes from "prop-types";

export default function EnhancedTableHead(props) {
    const { headCells, classes, order, orderBy, onRequestSort, checkBoxAllCell } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {checkBoxAllCell}
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
    headCells: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    checkBoxAllCell: PropTypes.object
};