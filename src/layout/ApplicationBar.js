import React, {useRef, useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {SwipeableSidebar} from "./SwipableSidebar";
import styles from '../utils/classes'

export default function ApplicationBar() {
    const classes = styles();
    const [applicationBarTitle, setApplicationBarTitle] = useState('');

    const sidebarRef = useRef();

    return (
        <div className={classes.appBarRoot}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
                    onClick={() => sidebarRef.current.toggle('left', true)}>
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