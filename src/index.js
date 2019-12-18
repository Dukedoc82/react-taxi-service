import React from 'react';
import ReactDOM from 'react-dom';
import Login from './login/Login'
import OrdersPage from './content/OrdersPage'

if (localStorage.getItem("userToken")) {
    ReactDOM.render(<OrdersPage />, document.getElementById('root'));
} else {
    ReactDOM.render(<Login />, document.getElementById('root'));
}