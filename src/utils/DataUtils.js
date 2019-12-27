import React from 'react';
import Icon from '@mdi/react'
import { mdiAlertCircleOutline, mdiAlertCircleCheckOutline, mdiCancel, mdiCheckboxMarkedCircleOutline } from '@mdi/js';
import {amber, green, lightBlue, red} from '@material-ui/core/colors'
import {Tooltip} from "@material-ui/core";

export function getUserFullName(user) {
    return user ?
        user.firstName + ' ' + user.lastName :
        '';
}

export function getStatusCaption(status) {
    switch (status) {
        case 'tp.status.assigned':
            return createTooltip("Assigned", mdiAlertCircleCheckOutline, amber[600]);
        case 'tp.status.opened':
            return createTooltip("Opened", mdiAlertCircleOutline, lightBlue[600]);
        case 'tp.status.cancelled':
            return createTooltip('Cancelled', mdiCancel, red[600]);
        case 'tp.status.completed':
            return createTooltip('Completed', mdiCheckboxMarkedCircleOutline, green[600]);
        default:
            return 'Unknown';
    }

}

function createTooltip(title, iconPath, iconColor) {
    return (
        <Tooltip title={title}>
            <Icon path={iconPath}
                  size={1}
                  color={iconColor}
            />
        </Tooltip>
    )
}

export const byClasses = classes => {
    return classes.join(' ');
};