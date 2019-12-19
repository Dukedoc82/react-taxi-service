import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import InputField from "./InputField";
import TextField from "@material-ui/core/TextField";
import ReactPhoneInput from "react-phone-input-mui";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const SubmitButton = () => {
    const classes = useStyles();
    return (
        <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
        >
            Sign Up
        </Button>
    )
}

export default class RegistrationForm extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const classes = useStyles();
        return (
            <form className={classes.form} noValidate onSubmit={this.props.onSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <InputField
                            autoComplete="fname"
                            name="firstName"
                            id="firstName"
                            label="First Name"
                            autoFocus
                            onChange={this.props.onFirstNameChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="lname"
                            onChange={this.props.onLastNameChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            error
                            onChange={this.props.onUserNameChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={this.props.onPasswordChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <span id='passwordErrorSpan' style={{color: '#f00'}}></span>
                    </Grid>
                    <Grid item xs={12}>
                        <ReactPhoneInput
                            onlyCountries={['ru']}
                            defaultCountry={'ru'}
                            onChange={this.props.onPhoneChange}
                            component={TextField}
                            inputExtraProps={{
                                required: true,
                                name: 'phone',
                                pattern: '8-(9[0-9]{2})-[0-9]{3}-[0-9]{4}',
                                type: 'tel'
                            }}
                        />
                    </Grid>
                </Grid>
                <SubmitButton/>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Link href="#" variant="body2" onClick={this.props.onSignInClick}>
                            Already have an account? Sign in
                        </Link>
                    </Grid>
                </Grid>
            </form>
        )
    }

}