import React, {useEffect, useState} from 'react';
import {PropTypes} from "prop-types";
import {Select} from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import {makeGetCall} from "../utils/ajaxRequest";

export default function RoleSelect(props) {
    const {onChange, selected} = props;
    const [roles, setRoles] = useState(null);

    const getValue = () => {
        return selected || '';
    };

    const createRoleItems = () => {
        return roles !== null ? roles.map(role => {
            return <MenuItem key={role.roleId} value={role.roleId}>{role.roleName}</MenuItem>
        }) : '';
    };

    const onRolesLoaded = (response) => {
        console.log(response);
        setRoles(response);
    };

    const getRoles = () => {
        makeGetCall("/admin/roles", onRolesLoaded);
    };

    useEffect(() => {
        if (roles === null) {
            getRoles();
        }
    }, roles);


    return (
        <Select value={getValue()} onChange={onChange}>
            {createRoleItems()}
        </Select>
    );

};

RoleSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.number
};