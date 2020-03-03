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
        ReactDOM.render(<AccountActivation text="Account successfully activated." showLink={true}/>, docRoot);
    };
    let onError = function(response) {
        ReactDOM.render(<AccountActivation text={response.message}/>, docRoot);
    };
    let ajax = {
        url: window.location.pathname,
        onSuccess: onSuccess,
        onError: onError
    };
    makeGetCall(ajax);
} else if (window.location.pathname.indexOf("/generateNewPassword/") !== -1) {
    let onSuccess = function() {
        ReactDOM.render(<AccountActivation text="Password successfully generated. The instructions are sent to you e-mail." showLink={false}/>, docRoot);
    };
    let onError = function(response) {
        ReactDOM.render(<AccountActivation text={response.message}/>, docRoot);
    };
    let ajax = {
        url: window.location.pathname,
        onSuccess: onSuccess,
        onError: onError
    };
    makeGetCall(ajax);

} else if (window.location.search === '?driver')
    ReactDOM.render(<SignUp/>, docRoot);
else if (localStorage.getItem("userToken")) {
    ReactDOM.render(<AppPage />, docRoot);
} else {
    ReactDOM.render(<SignIn />, docRoot);
}