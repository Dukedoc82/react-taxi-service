import ClearOutlined from '@material-ui/icons/ClearOutlined';
import React from "react";
import TooltipButton from "./TooltipButton";
import {PropTypes} from "prop-types";
import styles from "../../utils/classes";
import {byClasses} from "../../utils/DataUtils";
import RefreshOutlined from "@material-ui/icons/RefreshOutlined";

export default function RefreshButton(props) {
    const classes = styles();
    const { tooltip, onClick } = props;

    return (
        <TooltipButton onClick={onClick} tooltip={tooltip}
                       className={byClasses([classes.fabButton, classes.refreshButton, classes.smallButton])}
                       icon={<RefreshOutlined/>}/>
    );
};

RefreshButton.propTypes = {
    tooltip: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};