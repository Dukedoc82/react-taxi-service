import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PersistentSidebar from './PersistentSidebar'

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
    const [verticalMenuOpened, setVerticalMenuOpened] = useState(false);

    const onMenuClicked = (event) => {
        event.preventDefault();
        console.log(verticalMenuOpened);
        setVerticalMenuOpened(!verticalMenuOpened);
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
                    onClick={(e) => onMenuClicked(e)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        My Orders
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <PersistentSidebar open={verticalMenuOpened} handleDrawerClose={(e) => setVerticalMenuOpened(false)}/>
        </div>
    );
}