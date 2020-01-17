import React from 'react';
import ReactDOM from 'react-dom';
import SignIn from './login/SignIn'
import AppPage from "./content/AppPage";
import SignUp from "./login/SignUp";
import {makeGetCall} from "./utils/ajaxRequest";
import AccountActivation from "./login/AccountActivation";

const docRoot = document.getElementById('root');
localStorage.removeItem('serverUnavailable');
if (window.location.pathname.indexOf("/confirm/") !== -1) {
    let onSuccess = function() {
        console.log("success");
        ReactDOM.render(<AccountActivation text="Account successfully activated." showLink={true}/>, docRoot);
    };
    let onError = function(response) {
        console.log(response);
        ReactDOM.render(<AccountActivation text={response.message}/>, docRoot);
    };
    makeGetCall(window.location.pathname, onSuccess, onError)
} else if (window.location.search === '?driver')
    ReactDOM.render(<SignUp/>, docRoot);
else if (localStorage.getItem("userToken")) {
    ReactDOM.render(<AppPage />, docRoot);
} else {
    ReactDOM.render(<SignIn />, docRoot);
}