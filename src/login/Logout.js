import React from 'react';
import {makeGetCall} from "../utils/ajaxRequest";
import Login from "./Login";
import ReactDOM from 'react-dom';

export default class Logout extends HTMLElement {

    constructor(props) {
        super(props);
        this.addEventListener('click', e => {
            // Don't toggle the drawer if it's disabled.
            this.doLogout(e);
        });
    }


    onSuccessLogout = () => {
        localStorage.removeItem("userToken");
        ReactDOM.render(<Login/>, document.getElementById('root'));
    }

    doLogout = (event) => {
        event.preventDefault();
        makeGetCall("/doLogout", this.onSuccessLogout);
    }

    connectedCallback() {
        const mountPoint = document.createElement('span');
        this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

        ReactDOM.render(<a href='#'>Logout</a>, mountPoint);
    }

}

window.customElements.define('logout-link', Logout);