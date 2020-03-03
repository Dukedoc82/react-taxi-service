import CheckOutlined from '@material-ui/icons/CheckOutlined';
import React from "react";
import TooltipButton from "./TooltipButton";
import {PropTypes} from "prop-types";
import styles from "../../utils/classes";

export default function CompleteButton(props) {
    const classes = styles();
    const { tooltip, onClick } = props;

    return (
        <TooltipButton onClick={onClick} tooltip={tooltip}
                       className={classes.completeFab + ' ' + classes.smallButton + ' ' + classes.fabButton}
                       icon={<CheckOutlined/>}/>
    );
};

CompleteButton.propTypes = {
    tooltip: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};