import React from 'react';
import {makePostCall} from '../utils/ajaxRequest'
import {getStrDateFromTime} from '../utils/DateTimeUtils'
import OrdersPage from './OrdersPage'
import ReactDOM from 'react-dom';

class CreateOrder extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addressFrom: '',
            addressTo: '',
            appointmentHour: '',
            appointmentMinute: ''
        }
    }

    onAddressFromChange = (event) => {
        this.state.addressFrom = event.target.value;
    }

    onAddressToChange = (event) => {
        this.state.addressTo = event.target.value;
    }

    onAppointmentHourChange = (event) => {
        this.state.appointmentHour = event.target.value;
    }

    onAppointmentMinuteChange = (event) => {
        this.state.appointmentMinute = event.target.value;
    }

    successCreate = (response) => {
        ReactDOM.render(<OrdersPage />, document.getElementById('root'));
    }

    createOrder = (event) => {
        event.preventDefault();
        let body = {
            addressFrom: this.state.addressFrom,
            addressTo: this.state.addressTo,
            appointmentDate: getStrDateFromTime(this.state.appointmentHour, this.state.appointmentMinute)
        }
        makePostCall("http://localhost:8080/order/new", body, this.successCreate)
    }

    render() {
        return(<form onSubmit={this.createOrder}>
            <p>Address from: <input type='text' onChange={this.onAddressFromChange}/></p>
            <p>Address to: <input type='text' onChange={this.onAddressToChange}/></p>
            <p>Hour: <input type='number' onChange={this.onAppointmentHourChange}/></p>
            <p>Minute: <input type='number' onChange={this.onAppointmentMinuteChange}/></p>
            <input type='submit'/>
        </form>)
    }

}

export default CreateOrder