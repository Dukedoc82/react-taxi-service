import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {useStyles} from '../styles'
import Modal from "react-modal";
//import RegistrationForm from "./RegistrationForm";
import ReactDOM from 'react-dom';
import {makePostCall} from "../utils/ajaxRequest";
import OrdersPage from "../content/OrdersPage";
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Registration from './Registration'
import RegistrationForm from './RegistrationForm'
//import RegistrationForm2 from "./RegistrationForm2";

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

function showRegisterForm(event) {
    event.preventDefault();
    ReactDOM.render((<RegistrationForm/>), document.getElementById('root'));
}

const PaperDiv = (props) => {
    const classes = useStyles();
    return (
        <Container component="main" maxWidth="xs">
            <Modal
                isOpen={true}
                style={customStyles}
            >
                <CssBaseline />
                <div className={classes.paper}>

                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={props.onSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            onChange={props.onUserNameChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={props.onPasswordChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2" onClick={((e) => {showRegisterForm(e)})}>
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>

                </div>
            </Modal>
        </Container>
    )

}

export default class ModalForm2 extends React.Component {

    constructor() {
        super();
        this.state = {
            username: '',
            password: ''
        }
    }

    onSubmit = (event) => {
        event.preventDefault();
        let body = {
            username: this.state.username,
            password: this.state.password
        }
        makePostCall("/authenticate", body, this.successLogin, this.errorLogin, this.authError);
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

    onUsernameChange = (event) => {
        event.preventDefault();
        this.state.username = event.target.value;
    }

    onPasswordChange = (event) => {
        event.preventDefault();
        this.state.password = event.target.value;
    }

    render() {
        return (
            <PaperDiv
                onSubmit={this.onSubmit}
                onUserNameChange={this.onUsernameChange}
                onPasswordChange={this.onPasswordChange}
            />
        );
    }
}