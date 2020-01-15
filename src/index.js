import React from 'react';
import ReactDOM from 'react-dom';
import SignIn from './login/SignIn'
import AppPage from "./content/AppPage";
import SignUp from "./login/SignUp";
import {makeGetCall} from "./utils/ajaxRequest";

const docRoot = document.getElementById('root');
console.log(window.location.pathname.indexOf("/confirm/"));
if (window.location.pathname.indexOf("/confirm/") !== -1) {
    console.log("execute confirmation");
    let onSuccess = function() {
        console.log("success");
    };
    let onError = function(response) {
        console.log(response);
    };
    makeGetCall(window.location.pathname, onSuccess, onError)
} else if (window.location.search === '?driver') {
    ReactDOM.render(<SignUp/>, docRoot);
} else if (localStorage.getItem("userToken")) {
    ReactDOM.render(<AppPage />, docRoot);
} else {
    ReactDOM.render(<SignIn />, docRoot);
}