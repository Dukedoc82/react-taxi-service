import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import PropTypes from "prop-types";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function ConfirmDialog(props) {
    const {okHandler, cancelHandler, message, title, open, okText, cancelText} = props;
    const getDialogTitle = (title) => {
        let dialogTitle = !!title ? title : 'Confirm';
        return <DialogTitle id="alert-dialog-slide-title">{dialogTitle}</DialogTitle>;
    };

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            {getDialogTitle(title)}
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={okHandler} color="primary">
                    {okText || 'OK'}
                </Button>
                <Button onClick={cancelHandler} color="primary" autoFocus>
                    {cancelText || 'Cancel'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ConfirmDialog.propTypes = {
    open: PropTypes.any.isRequired,
    okHandler: PropTypes.func.isRequired,
    cancelHandler: PropTypes.func.isRequired,
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    okText: PropTypes.string,
    cancelText: PropTypes.string
};