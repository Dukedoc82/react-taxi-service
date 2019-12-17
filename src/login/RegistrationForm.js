import React from 'react';
import {makePostCall} from '../utils/ajaxRequest'
import Login from './Login'
import ReactDOM from 'react-dom';

class RegistrationForm extends React.Component {

    constructor(data) {
        super(data);
        this.state = {
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: ''
        }
    }

    usernameChangeHandler = (event) => {
        this.state.username = event.target.value;
    }

    passwordChangeHandler = (event) => {
        this.state.password = event.target.value;
    }

    firstNameChangeHandler = (event) => {
        this.state.firstName = event.target.value;
    }

    lastNameChangeHandler = (event) => {
        this.state.lastName = event.target.value;
    }

    phoneChangeHandler = (event) => {
        this.state.phoneNumber = event.target.value;
    }

    onRegisterSuccess = (response) => {
        alert("User successfully registered.");
        ReactDOM.render(<Login />, document.getElementById('root'));
    }

    onRegisterError = (response) => {
        alert(response);
    }

    registrationHandler = (event) => {
        event.preventDefault();
        let body = {
            userName: this.state.username,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber
        }
        makePostCall("http://localhost:8080/register", body, this.onRegisterSuccess, this.onRegisterError)
    }

    render() {
        return (
            <form onSubmit={this.registrationHandler}>
                <h1>Registration data</h1>
                <p>Username:</p>
                <input type='text' onChange={this.usernameChangeHandler}/>
                <p>Password:</p>
                <input type='text' onChange={this.passwordChangeHandler}/>
                <p>First Name:</p>
                <input type='text' onChange={this.firstNameChangeHandler}/>
                <p>Last Name:</p>
                <input type='text' onChange={this.lastNameChangeHandler}/>
                <p>Phone Number:</p>
                <input type='text' onChange={this.phoneChangeHandler}/>
                <input type='submit'/>
            </form>
        )
    }
}

export default RegistrationForm