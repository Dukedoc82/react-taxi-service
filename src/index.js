import React from 'react';
import ReactDOM from 'react-dom';
import Login from './login/Login'
import OrdersPage from './content/OrdersPage'
//import ModelForm from './login/ModalForm'
import ModalForm2 from './login/ModalForm2'

/*if (localStorage.getItem("userToken")) {
    ReactDOM.render(<OrdersPage />, document.getElementById('root'));
} else {*/
    //ReactDOM.render(<ModelForm />, document.getElementById('root'));
//}

ReactDOM.render(<ModalForm2/>, document.getElementById('root'));