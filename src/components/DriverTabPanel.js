import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import DriverOrdersTableCustomized from "../content/DriverOrdersTableCustomized";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function DriverTabPanel() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [openedOrder, setOpenedOrders] = React.useState(null);
    const [openedSelected, setOpenedSelected] = React.useState([]);
    const [assignedOrders, setAssignedOrders] = React.useState(null);
    const [assignedSelected, setAssignedSelected] = React.useState([]);
    const [completedOrders, setCompletedOrders] = React.useState(null);
    const [completedSelected, setCompletedSelected] = React.useState([]);


    const handleChange = (event, newValue) => {
        event.preventDefault();
        event.stopPropagation();
        setValue(newValue);
    }

    const changeOpenedOrderHandler = (orders, action) => {
        console.log(action);
        setOpenedOrders(orders);
        setOpenedSelected([]);
        if (action === 'assign' || action === 'refuse')
            setAssignedOrders(null);
        if (action === 'complete')
            setCompletedOrders(null);
    }

    const changeOpenedSelectedHandler = (selected) => {
        setOpenedSelected(selected);
    }

    const changeAssignedOrderHandler = (orders) => {
        setAssignedOrders(orders);
        setAssignedSelected([]);
    }

    const changeAssignedSelectedHandler = (selected) => {
        setAssignedSelected(selected);
    }

    const changeCompletedOrderHandler = (orders) => {
        if (orders) {
            setCompletedOrders(orders);
            setCompletedSelected([]);
        }
    }

    const changeCompletedSelectedHandler = (selected) => {
        setCompletedSelected(selected);
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" centered={true} variant={'fullWidth'} >
                    <Tab label="Client Requests" {...a11yProps(0)} />
                    <Tab label="Assigned to Me" {...a11yProps(1)} />
                    <Tab label="Closed Requests" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <DriverOrdersTableCustomized statuses={"opened"} orders={openedOrder} changeOrdersHandler={changeOpenedOrderHandler}
                                             selected={openedSelected} selectedChangeHandler={changeOpenedSelectedHandler}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <DriverOrdersTableCustomized statuses={"assigned"} orders={assignedOrders} changeOrdersHandler={changeAssignedOrderHandler}
                                             selected={assignedSelected} selectedChangeHandler={changeAssignedSelectedHandler}/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <DriverOrdersTableCustomized statuses={"closed"} orders={completedOrders} changeOrdersHandler={changeCompletedOrderHandler}
                                             selected={completedSelected} selectedChangeHandler={changeCompletedSelectedHandler}/>
        </TabPanel>
        </div>
    );

}