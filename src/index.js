import React from 'react';
import ReactDOM from 'react-dom';
import SignIn from './login/SignIn'
import AppPage from "./content/AppPage";
import SignUp from "./login/SignUp";

console.log(window.location);
if (window.location.search === '?driver')
    ReactDOM.render(<SignUp/>, document.getElementById('root'));
else if (localStorage.getItem("userToken")) {
    ReactDOM.render(<AppPage />, document.getElementById('root'));
} else {
    ReactDOM.render(<SignIn />, document.getElementById('root'));
}