import React, {forwardRef, useEffect, useImperativeHandle} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import OrdersTable from "../content/OrdersTable";
import clsx from 'clsx';
import {makeGetCall} from "../utils/ajaxRequest";
import ReactDOM from "react-dom";
import SignIn from "../login/SignIn";
import {red, grey, yellow} from '@material-ui/core/colors'
import Icon from "@mdi/react";
import { mdiPower, mdiCarShiftPattern, mdiTaxi } from '@mdi/js';
import DriverTabPanel from "../components/DriverTabPanel";

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

export const SwipeableSidebar = forwardRef((props, ref) => {
    const {setApplicationBarTitle} = props;
    const classes = useStyles();
    const [state, setState] = React.useState({
        left: false
    });

    useImperativeHandle(ref, () => ({

        toggle() {
            toggleSideBar('left', true);
        }
    }));

    const doLogout = (event) => {
        event.preventDefault();
        makeGetCall("/doLogout", onSuccessLogout);
    };

    const onSuccessLogout = () => {
        localStorage.removeItem("userToken");
        ReactDOM.render(<SignIn/>, document.getElementById('root'));
    };

    const handleClick = (menuTitle) => {
        setApplicationBarTitle(menuTitle.text);
        if (menuTitle.id === 'driverDashboard') {
            ReactDOM.render(<DriverTabPanel />, document.getElementById('mainContent'));
        } else if (menuTitle.id === 'userDashboard') {
            ReactDOM.render(<OrdersTable/>, document.getElementById('mainContent'));
        }
    };

    const toggleSideBar = (side, open) => {
        setState({ ...state, [side]: open });
    };

    const driverDashboardMenuItem = {id: 'driverDashboard', text: 'Driver Dashboard', icon: <Icon path={mdiCarShiftPattern}
                                                                                                  size={1}
                                                                                                  color={grey[900]}/>};
    const clientDashboardMenuItem = {id: 'userDashboard', text: 'Client Dashboard', icon: <Icon path={mdiTaxi}
                                                                                                size={1}
                                                                                                color={yellow[700]}/>};
    let menuTitles = [clientDashboardMenuItem];
    let userData = JSON.parse(localStorage.getItem('userData'));
    if (userData.uri.indexOf("/driver/") !== -1)
        menuTitles.push(driverDashboardMenuItem);

    useEffect(() => {
        setApplicationBarTitle(menuTitles[0].text);
    }, []);

    const toggleDrawer = (side, open) => event => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {

            return;
        }
        setState({ ...state, [side]: open });
    };

    const sideList = side => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
            <List>
                {menuTitles.map((menuTitle) => (
                    <ListItem button key={menuTitle.id} onClick={() => {handleClick(menuTitle)}}>
                        <ListItemIcon>{menuTitle.icon}</ListItemIcon>
                        <ListItemText primary={menuTitle.text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['Sign Out'].map((text) => (
                    <ListItem button key={text} onClick={(e)=>doLogout(e)}>
                        <ListItemIcon><Icon path={mdiPower}
                              size={1}
                              color={red[600]}
                        /></ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <div>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: state.left.open,
                })}
            >

                <div id='mainContent'>
                    <div className={classes.drawerHeader} />
                    <OrdersTable/>

                </div>
            </main>
            <SwipeableDrawer
                open={state.left}
                onClose={toggleDrawer('left', false)}
                onOpen={toggleDrawer('left', true)}
            >
                {sideList('left')}
            </SwipeableDrawer>
        </div>
    );
});
