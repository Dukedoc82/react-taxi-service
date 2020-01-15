import React from 'react';
import styles from '../utils/classes'
import {PropTypes} from "prop-types";

export default function AccountActivation(props) {
    const {message, showLink} = props;
    const classes = styles();

    const getAppLinkContainer = () => {
        return !!showLink ? (
            <div className={classes.appLinkContainer}>
                <a href="http://localhost:3000">Go to the application</a>
            </div>
        ) : '';
    };

    return (
        <div className={classes.confirmedContainer}>
            <div className={classes.messagePaper}>
                <span>
                    {message}
                </span>
                <br/>
                {getAppLinkContainer()}
            </div>
        </div>
    );
};

AccountActivation.propTypes = {
    message: PropTypes.string.isRequired,
    showLink: PropTypes.bool
};