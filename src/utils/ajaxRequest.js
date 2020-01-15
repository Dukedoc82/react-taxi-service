import React from "react";
import properties from '../properties'
import ReactDOM from 'react-dom';
import SignIn from "../login/SignIn";

export function makePostCall(url, body, success, error, authError, disabledError) {
    makeBodyCall("POST", url, body, success, error, authError, disabledError);
}

export function makePutCall(url, body, success, error, authError, disabledError) {
    makeBodyCall("PUT", url, body, success, error, authError, disabledError);
}

export function makeGetCall(url, success, error, authError, disabledError) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", properties.backendServer + url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("usertoken", localStorage.getItem("userToken"));
    xhr.send();
    xhr.onreadystatechange = function() {
        onReadyStateChange(xhr, success, error, authError, disabledError);
    }
}

function onReadyStateChange(xhr, success, error, authError, disabledError) {
    console.log(xhr);
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status !== 200) {
            if (xhr.status === 500) {
                if (error)
                    error(JSON.parse(xhr.responseText));
                else {
                    defaultErrorHandler(xhr);
                }
            } else if (xhr.status === 401) {
                if (authError)
                    authError(xhr);
                else
                    defaultErrorHandler(xhr);
            } else if (xhr.status === 403) {
                if (disabledError)
                    disabledError(xhr);
                else
                    defaultErrorHandler(xhr);
            } else {
                defaultErrorHandler(xhr);
            }
        } else {
            if (xhr.status === 200) {
                if (xhr.getAllResponseHeaders().indexOf("usertoken") >= 0) {
                    if (xhr.getResponseHeader("usertoken")) {
                        localStorage.setItem("userToken", xhr.getResponseHeader("usertoken"));
                    }
                }
                if (success)
                    success(xhr && xhr.responseText ? JSON.parse(xhr.responseText) : null);
            }
        }
    }
}

function makeBodyCall(method, url, body, success, error, authError, disabledError) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, properties.backendServer + url, true, );
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("usertoken", localStorage.getItem("userToken"));
    xhr.send(JSON.stringify(body));
    xhr.onreadystatechange = function() {
        onReadyStateChange(xhr, success, error, authError, disabledError);
    }
}

function defaultErrorHandler(xhr) {
    if (xhr.status === 401) {
        localStorage.removeItem("userToken");
        ReactDOM.render(<SignIn/>, document.getElementById('root'));
    } else {
        alert(xhr.status + ": " + xhr.responseText);
    }
}