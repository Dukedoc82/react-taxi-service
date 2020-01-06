import Fab from "@material-ui/core/Fab";
import CheckOutlined from '@material-ui/icons/CheckOutlined';
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import styles from '../../utils/classes';
import PropTypes from 'prop-types'

export default function AssignButton(props) {
    const classes = styles();

    const {onClick, tooltip} = props;

    return (
        <Tooltip title={tooltip}>
            <div className={classes.statusDiv}>
                <Fab size='small' className={classes.assignFab + ' ' + classes.smallButton} onClick={onClick}>
                    <CheckOutlined/>
                </Fab>
            </div>
        </Tooltip>
    );
};

AssignButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    tooltip: PropTypes.string.isRequired
};