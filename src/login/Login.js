import React from 'react';
import OrdersPage from "../content/OrdersPage"
import {makePostCall} from '../utils/ajaxRequest'
import RegistrationForm from './RegistrationForm'
import ReactDOM from 'react-dom';
import properties from '../properties'

class Login extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    successLogin = function(data) {
        //alert(data.uri);
        ReactDOM.render(< OrdersPage/>, document.getElementById('root'));
    }

    errorLogin = function(error) {
        alert(error.message);
    }

    authError = function(error) {
        console.log(error.status);
    }

    mySubmitHandler = (event) => {
        event.preventDefault();
        let body = {
            username: this.state.username,
            password: this.state.password
        }
        makePostCall(properties.backendServer + "/authenticate", body, this.successLogin, this.errorLogin, this.authError);
    }

    usernameChangeHandler = (event) => {
        this.setState({username: event.target.value});
    }

    passwordChangeHandler = (event) => {
        this.setState({password: event.target.value});
    }

    showRegisterForm = (event) => {
        ReactDOM.render(<RegistrationForm/>, document.getElementById('root'));
    }

    render() {
        return (
            <div>
                <form onSubmit={this.mySubmitHandler}>
                    <h1>Hello {this.state.username}</h1>
                    <p>Enter your name:</p>
                    <input
                        type='text' id='username'
                        onChange={this.usernameChangeHandler}
                    />
                    <p>
                        <input type='text' id='password'
                        onChange={this.passwordChangeHandler}/>
                    </p>
                    <input
                        type='submit'
                    />
                </form>
                <button onClick={this.showRegisterForm}>Register</button>
            </div>)
    }

}

export default Login