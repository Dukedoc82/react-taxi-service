import React from 'react';
import {PropTypes} from "prop-types";

export default function AccountActivation(props) {
    const {text, showLink} = props;

    const getLinkBlock = () => {
        let appUrl = window.location.origin;
        return showLink ? (
            <div style={{
                alignItems: 'center',
                textAlign: 'center'
            }}>
                <a href={appUrl}>Go to the application</a>
            </div>
        ) : '';
    };

    return (
        <div style={{
            marginTop: '2em',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: '#eee',
                margin: '2em',
                padding: '2em',
                borderRadius: '6px',
                maxWidth: '40%',
                alignItems: 'center'
            }}>
                <span>
                    {text}
                </span>
                <br/>
                {getLinkBlock()}
            </div>

        </div>
    )
};

AccountActivation.propTypes = {
    text: PropTypes.string.isRequired
};