import React, {useEffect} from 'react';
import ReactDOM from 'react-dom'
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import LocalTaxi from '@material-ui/icons/LocalTaxi'
import {makeGetCall} from "../utils/ajaxRequest";
import SignIn from "../login/SignIn";
import OrdersTable from "../content/OrdersTable"
import DriverTabPanel from "../components/DriverTabPanel";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    avatar: {
        backgroundColor: theme.palette.secondary.main,
        width: '30px',
        height: '30px'
    }
}));

export default function PersistentDrawerLeft(props) {
    const classes = useStyles();
    const theme = useTheme();
    const {open, handleDrawerClose, setApplicationBarTitle} = props;

    const onSuccessLogout = () => {
        localStorage.removeItem("userToken");
        ReactDOM.render(<SignIn/>, document.getElementById('root'));
    };

    const doLogout = (event) => {
        event.preventDefault();
        makeGetCall("/doLogout", onSuccessLogout);
    };

    const handleClick = (menuTitle) => {
        setApplicationBarTitle(menuTitle.text);
        if (menuTitle.id === 'driverDashboard') {
            ReactDOM.render(<DriverTabPanel />, document.getElementById('mainContent'));
        } else if (menuTitle.id === 'userDashboard') {
            ReactDOM.render(<OrdersTable/>, document.getElementById('mainContent'));
        }
    };

    const driverDashboardMenuItem = {id: 'driverDashboard', text: 'Driver Dashboard'};
    const clientDashboardMenuItem = {id: 'userDashboard', text: 'Client Dashboard'};
    let menuTitles = [clientDashboardMenuItem];
    let userData = JSON.parse(localStorage.getItem('userData'));
    if (userData.uri.indexOf("/driver/") !== -1)
        menuTitles.push(driverDashboardMenuItem);


    useEffect(() => {
        setApplicationBarTitle(menuTitles[0].text);
    }, []);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >

                <div className={classes.drawerHeader}>
                    <div>
                        User Name
                    </div>
                    <IconButton onClick={(e) => handleDrawerClose(e)}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {menuTitles.map((menuTitle) => (
                        <ListItem button key={menuTitle.id} onClick={() => {handleClick(menuTitle)}}>
                            <ListItemIcon><Avatar className={classes.avatar}><LocalTaxi/></Avatar></ListItemIcon>
                            <ListItemText primary={menuTitle.text} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {['Sign Out'].map((text) => (
                        <ListItem button key={text} onClick={(e)=>doLogout(e)}>
                            <ListItemIcon><PowerSettingsNew/></ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >

                <div id='mainContent'>
                    <div className={classes.drawerHeader} />
                    <OrdersTable/>

                </div>
            </main>
        </div>
    );
}