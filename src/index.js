import React from 'react';
import ReactDOM from 'react-dom';
import SignIn from './login/SignIn'
import AppPage from "./content/AppPage";
import SignUp from "./login/SignUp";
import {makeGetCall} from "./utils/ajaxRequest";
import AccountActivation from "./login/AccountActivation";

const docRoot = document.getElementById('root');
localStorage.removeItem('serverUnavailable');
if (window.location.search.indexOf("?confirm=") !== -1) {
    let onSuccess = function() {
        ReactDOM.render(<AccountActivation text="Account successfully activated." showLink={true}/>, docRoot);
    };
    let onError = function(response) {
        ReactDOM.render(<AccountActivation text={response.message}/>, docRoot);
    };
    let ajax = {
        url: "/confirm/" + window.location.search.split('=')[1],
        onSuccess: onSuccess,
        onError: onError
    };
    makeGetCall(ajax);
} else if (window.location.search.indexOf("?generateNewPassword=") !== -1) {
    let onSuccess = function() {
        ReactDOM.render(<AccountActivation text="Password successfully generated. The instructions are sent to you e-mail." showLink={true}/>, docRoot);
    };
    let onError = function(response) {
        ReactDOM.render(<AccountActivation text={response.message}/>, docRoot);
    };
    let ajax = {
        url: "/generateNewPassword/" + window.location.search.split('=')[1],
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