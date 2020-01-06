import CheckOutlined from '@material-ui/icons/CheckOutlined';
import React from "react";
import styles from '../../utils/classes';
import PropTypes from 'prop-types'
import TooltipButton from "./TooltipButton";

export default function AssignButton(props) {
    const classes = styles();

    const {onClick, tooltip} = props;

    return (
        <TooltipButton onClick={onClick} tooltip={tooltip} className={classes.assignFab + ' ' + classes.smallButton}
                       icon={<CheckOutlined/>}/>
    );
};

AssignButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    tooltip: PropTypes.string.isRequired
};