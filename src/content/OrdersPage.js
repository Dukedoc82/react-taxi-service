import React from 'react';
import ReactDOM from 'react-dom';
import {makeGetCall, makePutCall} from "../utils/ajaxRequest";
import CreateOrder from './CreateOrder'
import '../index.css'
import {getFormattedDateFromISOString} from '../utils/DateTimeUtils'

class OrdersPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            orders: []
        };
        this.getOrders();
    }

    success = (data) => {
        this.setState({orders: data});
    }

    getOrders = () => {
        makeGetCall("/order/", this.success);
    }

    showCreateOrderForm = () => {
        ReactDOM.render(<CreateOrder/>, document.getElementById('root'));
    }

    getDriverFullName = (driver) => {
        return driver === null ? '' : driver.firstName + ' ' + driver.lastName;
    }

    cancelOrder = (event, orderId) => {
        event.preventDefault();
        makePutCall("/order/cancel/" + orderId, null, this.getOrders);
    }

    getOrderActions = (status, orderId) => {
        console.log({status: status, orderId: orderId});
        /*if (status.titleKey === 'tp.status.cancelled' || status.titleKey === 'tp.status.completed') {
            return ''
        } else {
            return (
                <a href='#' onClick={this.cancelOrder(orderId)}>Cancel</a>
            )
        }*/
        return 'Cancel';
    }

    render() {
        return (
            <div>
                <h1>React Dynamic Table</h1>
                <table id='students'>
                    <tbody>
                    <tr>
                        <th>#</th>
                        <th>update Date</th>
                        <th>Client First Name</th>
                        <th>Address from</th>
                        <th>Address to</th>
                        <th>Driver</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                    {this.state.orders.map((orderDetails, index) => {
                        const { updatedOn, order, driver, status } = orderDetails //destructuring
                        return (
                            <tr id={order.id} key={order.id}>
                                <td>{index + 1}</td>
                                <td>{getFormattedDateFromISOString(updatedOn)}</td>
                                <td>{order.client.firstName}</td>
                                <td>{order.addressFrom}</td>
                                <td>{order.addressTo}</td>
                                <td>{this.getDriverFullName(driver)}</td>
                                <td>{status.titleKey}</td>
                                <td><a href='#' orderid={order.id} onClick={((e) => this.cancelOrder(e, order.id))}>Cancel</a></td>
                            </tr>
                        )
                    })
                    }
                    </tbody>
                </table>
                <button onClick={this.showCreateOrderForm}>+</button>
            </div>

        )
    }

}

export default OrdersPage