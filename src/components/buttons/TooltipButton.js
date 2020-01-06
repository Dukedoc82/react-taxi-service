import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import styles from '../../utils/classes';
import PropTypes from 'prop-types'

export default function TooltipButton(props) {
    const classes = styles();

    const {onClick, tooltip, className, icon} = props;

    return (
        <Tooltip title={tooltip}>
            <div className={classes.statusDiv}>
                <Fab size='small' className={className} onClick={onClick}>
                    {icon}
                </Fab>
            </div>
        </Tooltip>
    );
};

TooltipButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    tooltip: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired
};