import React from 'react';
import TextField from "@material-ui/core/TextField";

export default class InputField extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TextField
                autoComplete={this.props.autoComplete}
                name={this.props.name}
                variant="outlined"
                required
                fullWidth
                id={this.props.id}
                label={this.props.label}
                autoFocus={this.props.autoFocus}
                onChange={this.props.onFirstNameChange}
            />
        )
    }

}