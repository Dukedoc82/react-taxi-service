import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
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
import {blue, red, green, grey, yellow} from '@material-ui/core/colors'
import Icon from "@mdi/react";
import { mdiPower, mdiCarShiftPattern, mdiTaxi, mdiAccountCardDetails, mdiWrench, mdiCarKey } from '@mdi/js';
import DriverTabPanel from "../components/DriverTabPanel";
import {Typography} from "@material-ui/core";
import PropTypes from 'prop-types'
import {byClasses, getUserFullName} from "../utils/DataUtils";
import AdminPanel from "../components/AdminPanel";
import styles from '../utils/classes'
import SettingsPage from "../content/SettingsPage";
import Tooltip from "@material-ui/core/Tooltip";
import UserDetailsDialog from "../content/UserDetailsDialog";

export const SwipeableSidebar = forwardRef((props, ref) => {
    const {setApplicationBarTitle} = props;
    const classes = styles();
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
        let ajax = {
            url: '/doLogout',
            onSuccess: onSuccessLogout
        };
        makeGetCall(ajax);
    };

    const onSuccessLogout = () => {
        localStorage.removeItem("userToken");
        ReactDOM.render(<SignIn/>, document.getElementById('root'));
    };

    const toggleSideBar = (side, open) => {
        setState({ ...state, [side]: open });
    };

    const driverDashboardMenuItem = {id: 'driverDashboard', text: 'Driver Dashboard', icon: <Icon path={mdiCarKey}
                                                                                                  size={1}
                                                                                                  color={green[600]}/>};
    const clientDashboardMenuItem = {id: 'userDashboard', text: 'Client Dashboard', icon: <Icon path={mdiTaxi}
                                                                                                size={1}
                                                                                                color={yellow[700]}/>};
    const adminDashboardMenuITem = {id: 'adminDashboard', text: 'Admin Dashboard', icon: <Icon path={mdiCarShiftPattern}
                                                                                               size={1}
                                                                                               color={grey[900]}/> };
    const [menuTitles] = useState([clientDashboardMenuItem]);

    const [currentView, setCurrentView] = useState(menuTitles[0]);

    const getDashboards = () => {
        return menuTitles.map((menuTitle) => (
            <ListItem button key={menuTitle.id} onClick={() => setView(menuTitle)}>
                <ListItemIcon>{menuTitle.icon}</ListItemIcon>
                <ListItemText primary={menuTitle.text} />
            </ListItem>
        ))
    };

    const setView = (menuTitle) => {
        setMyState(myState + 1);
        setCurrentView(menuTitle);
    };
    
    const getCurrentView = () => {
        setApplicationBarTitle(currentView.text);
        switch (currentView.id) {
            case 'driverDashboard':
                return <DriverTabPanel/>;
            case 'adminDashboard':
                return <AdminPanel/>;
            case 'mailSettings':
                return <SettingsPage/>;
            case 'userSettings':
                return <UserDetailsDialog/>;
            default:
                return <OrdersTable/>;
        }
    };

    const [myState, setMyState] = useState(1);

    const onRolesLoaded = (response) => {
        if (response.driver) {
            menuTitles[0] = driverDashboardMenuItem;
        }
        if (response.admin) {
            menuTitles.push(adminDashboardMenuITem);
            menuTitles.push(driverDashboardMenuItem);
        }
        setApplicationBarTitle(menuTitles[0].text);
        setCurrentView(menuTitles[0]);
    };

    useEffect(() => {
        if (myState === 1) {
            let ajax = {
                url: '/userRoles/' + localStorage.getItem('userToken'),
                onSuccess: onRolesLoaded
            };
            makeGetCall(ajax);
            setApplicationBarTitle(menuTitles[0].text);
            setMyState(2);
        }
    }, [menuTitles, myState, setApplicationBarTitle]);

    const getUserName = () => {
        let user = JSON.parse(localStorage.getItem('userData'));
        return getUserFullName(user.user);
    };

    const toggleDrawer = (side, open) => event => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {

            return;
        }
        setState({ ...state, [side]: open });
    };

    const { drawerHeader, userNameDiv, userNameTypography, content, contentShift } = classes;

    const sideList = side => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
            <div className={drawerHeader}>
                <Tooltip title="Edit Profile" onClick={() => setView({id: 'userSettings'})}>
                <Icon path={mdiAccountCardDetails}
                      size={3}
                      color={green[600]}/>
                </Tooltip>
            </div>
            <div className={byClasses([drawerHeader, userNameDiv])}>
                <Typography className={userNameTypography}>
                    {getUserName()}
                </Typography>
            </div>
            <Divider/>
            <List>
                {getDashboards()}
            </List>
            <Divider />
            <List>
                {['Settings'].map((text) => (
                    <ListItem button key={text} onClick={() => setView({id: 'mailSettings', text: 'Settings'})}>
                        <ListItemIcon><Icon path={mdiWrench}
                                            size={1}
                                            color={blue[600]}
                        /></ListItemIcon>
                        <ListItemText primary={text} />
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
                className={clsx(content, {
                    [contentShift]: state.left.open,
                })}
            >

                <div id='mainContent' style={{padding: '2em 2em 1em 2em'}}>
                    {getCurrentView()}
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

SwipeableSidebar.propTypes = {
    setApplicationBarTitle: PropTypes.any.isRequired
};
