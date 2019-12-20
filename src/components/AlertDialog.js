import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function AlertDialog(props) {
    const getDialogTitle = (title) => {
        return !!title ?
            (<DialogTitle id="alert-dialog-slide-title">{props.title}</DialogTitle>) :
            '';
    }

    return (
            <Dialog
                open={props.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={props.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                {getDialogTitle(props.title)}
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {props.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
    );
}