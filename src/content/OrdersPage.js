import React from 'react';
import ReactDOM from 'react-dom';
import {makeGetCall} from "../utils/ajaxRequest";
import CreateOrder from './CreateOrder'
import '../index.css'

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
        makeGetCall("http://localhost:8080/order/", this.success);
    }

    showCreateOrderForm = () => {
        ReactDOM.render(<CreateOrder/>, document.getElementById('root'));
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
                    </tr>
                    {this.state.orders.map((orderDetails, index) => {
                        const { updatedOn, order } = orderDetails //destructuring
                        return (
                            <tr key={updatedOn}>
                                <td>{index + 1}</td>
                                <td>{updatedOn}</td>
                                <td>{order.client.firstName}</td>
                                <td>{order.addressFrom}</td>
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