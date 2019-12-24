import React from 'react';
import ReactDOM from 'react-dom';
import SignIn from './login/SignIn'
import AppPage from "./content/AppPage";
import SignUp from "./login/SignUp";

const docRoot = document.getElementById('root');
if (window.location.search === '?driver')
    ReactDOM.render(<SignUp/>, docRoot);
else if (localStorage.getItem("userToken")) {
    ReactDOM.render(<AppPage />, docRoot);
} else {
    ReactDOM.render(<SignIn />, docRoot);
}