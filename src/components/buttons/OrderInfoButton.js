import React from 'react';
import Fab from "@material-ui/core/Fab";
import Icon from "@mdi/react";
import {mdiCarInfo} from "@mdi/js";
import Tooltip from "@material-ui/core/Tooltip";
import styles from '../../utils/classes';
import PropTypes from 'prop-types';

export default function OrderInfoButton(props) {
    const classes = styles();
    const {onClick} = props;

    return (
        <Tooltip title="Order Details">
            <div className={classes.statusDiv}>
                <Fab size='small' className={classes.infoFab + ' ' + classes.smallButton + ' ' + classes.fabButton}
                     onClick={onClick}>
                    <Icon path={mdiCarInfo} size={1} color={'#fff'}/>
                </Fab>
            </div>
        </Tooltip>
    )
};

OrderInfoButton.propTypes = {
    onClick: PropTypes.func.isRequired
};