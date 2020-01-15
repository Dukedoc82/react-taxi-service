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
    confirmedContainer: {
        marginTop: '2em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    messagePaper: {
        backgroundColor: '#eee',
        margin: '2em',
        padding: '2em',
        borderRadius: '6px',
        maxWidth: '40%',
        alignItems: 'center'
    },
    appLinkContainer: {
        alignItems: 'center',
        textAlign: 'center'
    }
}));

export default function styles() {
    return appStyles();
}