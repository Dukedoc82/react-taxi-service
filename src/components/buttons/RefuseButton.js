import ClearOutlined from '@material-ui/icons/ClearOutlined';
import React from "react";
import TooltipButton from "./TooltipButton";
import {PropTypes} from "prop-types";
import styles from "../../utils/classes";

export default function RefuseButton(props) {
    const classes = styles();
    const { tooltip, onClick } = props;

    return (
        <TooltipButton onClick={onClick} tooltip={tooltip} className={classes.cancelFab + ' ' + classes.smallButton + ' ' + classes.fabButton}
                       icon={<ClearOutlined/>}/>
    );
};

RefuseButton.propTypes = {
    tooltip: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};