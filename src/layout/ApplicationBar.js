import React, {useRef, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {SwipeableSidebar} from "./SwipableSidebar";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        height: '100%'
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function ApplicationBar() {
    const classes = useStyles();
    const [applicationBarTitle, setApplicationBarTitle] = useState('');

    const sidebarRef = useRef();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
                    onClick={(e) => sidebarRef.current.toggle('left', true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {applicationBarTitle}
                    </Typography>

                </Toolbar>
            </AppBar>
            <SwipeableSidebar ref={sidebarRef} setApplicationBarTitle={setApplicationBarTitle}/>
        </div>
    );
}