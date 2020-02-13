import React, {useState} from 'react';
import {Select} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import {makeGetCall, makePutCall} from "../utils/ajaxRequest";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import BlockUi from "react-block-ui";
import CssBaseline from "@material-ui/core/CssBaseline";

const useStyles = makeStyles(theme => ({
    userDataGrid: {
        width: '30em',
        padding: '2em'
    },
    select: {
        '& div': {
            padding: '10px'
        }
    },
    labelDiv: {
        display: 'flex',
        alignItems: 'center',
        ...theme.mixins.toolbar,
        minHeight: 0,
        height: 'fit-content',
        '& div.MuiOutlinedInput-root': {
            fontSize: '0.75em'
        }
    },
    textField: {
        width: '100%',
        '& input': {
            padding: '0.5em'
        }
    },
    roleSelect: {
        width: '100%',
        '& div': {
            padding: '10px'
        }
    },
    editField: {

    }
}));

export default function UsersView() {

    const classes = useStyles();

    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');

    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [loadingUser, setLoadingUser] = useState(false);

    const [roles, setRoles] = useState(null);
    const [users, setUsers] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedRoleId, setSelectedRoleId] = useState('');

    const onUserDataLoaded = (response) => {
        setLoadingUser(false);
        setSelectedUser(response);
        setFirstName(response.firstName);
        setLastName(response.lastName);
        setSelectedRoleId(response.role.roleId);
    };

    const isNotDataChanged = () => {
        if (!selectedUser)
            return true;
        if (!firstName || !lastName)
            return true;
        return !firstName && !(selectedUser.firstName !== firstName || selectedUser.lastName !== lastName
            || selectedUser.role.roleId !== selectedRoleId);
    };

    const onUserSelect = (event) => {
        event.preventDefault();
        setLoadingUser(true);
        let ajax = {
            url: '/admin/userEdit/' + event.target.value,
            onSuccess: onUserDataLoaded
        };
        makeGetCall(ajax);
    };

    const getUsersList = () => {
        return users ? users.map(item => {
            return (<MenuItem key={item.userId} value={item.userId}>{item.lastName + ' ' + item.firstName}</MenuItem>);
        }) : '';
    };

    const onUsersLoaded = (response) => {
        setLoadingUsers(false);
        setUsers(response);
        let ajax = {
            url: '/admin/userEdit/' + response[0].userId,
            onSuccess: onUserDataLoaded
        };
        makeGetCall(ajax);
    };

    const onRolesLoaded = (response) => {
        setLoadingRoles(false);
        setRoles(response.map(item => {
            let roleAlias = item.roleName;
            switch (roleAlias) {
                case 'ROLE_ADMIN':
                    item.roleName = 'Application Administrator';
                    break;
                case 'ROLE_DRIVER':
                    item.roleName = 'Driver';
                    break;
                default:
                    item.roleName = 'User';

            }
            return item;
        }));
    };

    const getSelectedUserId = () => {
        return selectedUser ? selectedUser.userId : '';
    };

    const createUserList = () => {
        let ajax = {
            url: '/admin/user/',
            onSuccess: onUsersLoaded
        };
        makeGetCall(ajax);
    };

    const createRolesList = () => {
        let ajax = {
            url: '/admin/roles',
            onSuccess: onRolesLoaded
        };
        makeGetCall(ajax);
    };

    const createRoleItems = () => {
        return roles !== null ? roles.map(role => {
            return <MenuItem key={role.roleId} value={role.roleId}>{role.roleName}</MenuItem>
        }) : '';
    };

    const onFirstNameChange = (event) => {
        event.preventDefault();
        setFirstName(event.target.value);
        setFirstNameError(!!event.target.value ? '' : 'First Name can not be empty');
    };

    const onLastNameChange = (event) => {
        event.preventDefault();
        setLastName(event.target.value);
        setLastNameError(!!event.target.value ? '' : 'Last Name can not be empty');
    };

    const onRoleChange = (event) => {
        event.preventDefault();
        setSelectedRoleId(event.target.value);
    };

    const updateUser = () => {
        let ajax = {
            url: '/admin/updateUser',
            body: {
                userId: selectedUser.userId,
                firstName: firstName,
                lastName: lastName,
                role: {
                    roleId: selectedRoleId
                }
            }
        };
        makePutCall(ajax);
    };

    if (users === null)
        createUserList();
    if (roles === null)
        createRolesList();

    return (
        <div>
            <CssBaseline/>
            <BlockUi tag='div' blocking={loadingUsers || loadingRoles}>
                <Select id='user-select' value={getSelectedUserId()}
                        onChange={onUserSelect} variant="outlined" className={classes.select}
                >
                    {getUsersList()}
                </Select>
                <BlockUi tag='div' blocking={loadingUser}>
                    <Grid container spacing={1} className={classes.userDataGrid}>
                        <Grid item xs={4} sm={4} className={classes.labelDiv}>
                            <b>
                            First Name:
                            </b>
                        </Grid>
                        <Grid item xs={8} sm={8} className={classes.labelDiv}>
                            <TextField value={firstName} variant="outlined" className={classes.textField}
                                       onChange={onFirstNameChange} error={!!firstNameError} helperText={firstNameError}>
                            </TextField>
                        </Grid>
                        <Grid item xs={4} sm={4} className={classes.labelDiv}>
                            Last Name:
                        </Grid>
                        <Grid item xs={8} sm={8} className={classes.labelDiv}>
                            <TextField value={lastName} variant="outlined" className={classes.textField}
                                       onChange={onLastNameChange} error={!!lastNameError} helperText={lastNameError}/>
                        </Grid>
                        <Grid item xs={4} sm={4} className={classes.labelDiv}>
                            Role:
                        </Grid>
                        <Grid item xs={8} sm={8} className={classes.labelDiv}>
                            <Select value={selectedRoleId} onChange={onRoleChange}
                                    className={classes.roleSelect} variant="outlined">
                                {createRoleItems()}
                            </Select>
                        </Grid>
                    </Grid>
                <Button variant="contained" disabled={isNotDataChanged()} color="primary" onClick={updateUser}>Save</Button>
                </BlockUi>
            </BlockUi>
        </div>
    )
}