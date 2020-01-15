import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {blue, green, lightBlue, red} from "@material-ui/core/colors";

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
    refreshButton: {
        backgroundColor: blue[600],
    },
    fabButton: {
        color: '#fff',
        boxShadow: 'none',
        margin: '0.25em'
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
        padding: theme.spacing(0, 0),
        ...theme.mixins.toolbar,
        justifyContent: 'center',
        'min-height': '0px !important'
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'center',
    },
    userNameDiv: {
        paddingTop: 0,
        minHeight: '1em',
        paddingBottom: '1em'
    },
    userNameTypography: {
        fontWeight: 'bold',
        fontSize: '0.875rem'
    },
    appBarRoot: {
        flexGrow: 1,
        height: '100%'
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    orderInfoDialog: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 0),
        ...theme.mixins.toolbar,
        justifyContent: 'center',
        'min-height': '0px !important'
    },
    orderInfoDialogContent: {
        width: '500px'
    },
    boldText: {
        fontWeight: 'bold'
    },
    paper: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    errorSpan: {
        color: '#f44336',
        margin: '8px 14px 0',
        'font-size': '0.75rem'
    },
    success: {
        backgroundColor: green[600],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    }
}));

export default function styles() {
    return appStyles();
}