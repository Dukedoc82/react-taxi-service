import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {green, lightBlue, red} from "@material-ui/core/colors";

const appStyles = makeStyles(theme => ({
    assignFab: {
        backgroundColor: green[600],
    },
    cancelFab: {
        backgroundColor: red[600],
    },
    infoFab: {
        backgroundColor: lightBlue[600],
    },
    smallButton: {
        height: '30px',
        width: '30px',
        minWidth: '30px',
        minHeight: '30px',
        color: '#fff'
    },
    statusDiv: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'center',
        'min-height': '0px !important'
    },
}));

export default function styles() {
    return appStyles();
}