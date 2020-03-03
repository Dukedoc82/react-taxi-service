import {getUserFullName} from "./DataUtils";

export function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

export function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

function desc(a, b, orderBy) {
    if (orderBy === 'appointmentTime') {
        let aDate = new Date(a[orderBy]);
        let bDate = new Date(b[orderBy]);
        if (bDate < aDate) {
            return -1;
        }
        if (bDate > aDate) {
            return 1;
        }
        return 0;
    } else {
        switch (orderBy) {
            case 'client':
            case 'driver':
                return userComparison(a, b, orderBy);
            case 'status':
                return statusComparison(a, b, orderBy);
            default:
                return simpleComparison(a, b, orderBy);
        }
    }
}

function userComparison(a, b, orderBy) {
    let aUserName = getUserName(a[orderBy]);
    let bUserName = getUserName(b[orderBy]);
    if (bUserName === null && aUserName === null)
        return 0;
    if (bUserName === null)
        return -1;
    if (aUserName === null)
        return 1;
    if (bUserName < aUserName) {
        return -1;
    }
    if (bUserName > aUserName) {
        return 1;
    }
    return 0;
}

function statusComparison(a, b, orderBy) {
    let aStatus = a[orderBy].id;
    let bStatus = b[orderBy].id;
    if (bStatus < aStatus) {
        return -1;
    }
    if (bStatus > aStatus) {
        return 1;
    }
    return 0;
}

function simpleComparison(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getUserName(userObj) {
    if (!userObj) {
        return null;
    } else if (!userObj.userId) {
        return userObj;
    } else {
        return getUserFullName(userObj);
    }
}