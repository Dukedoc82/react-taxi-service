import React from 'react';
import ReactDOM from 'react-dom';
import SignIn from './login/SignIn'

/*if (localStorage.getItem("userToken")) {
    ReactDOM.render(<OrdersPage />, document.getElementById('root'));
} else {*/
    //ReactDOM.render(<ModelForm />, document.getElementById('root'));
//}

ReactDOM.render(<SignIn/>, document.getElementById('root'));