export function getDriverFullName(driver) {
    return driver ?
        driver.firstName + ' ' + driver.lastName :
        '';
}

export function getStatusCaption(status) {
    switch (status) {
        case 'tp.status.assigned':
            return 'Assigned';
        case 'tp.status.opened':
            return 'Opened';
        case 'tp.status.cancelled':
            return 'Cancelled';
        case 'tp.status.completed':
            return 'Completed';
    }

}