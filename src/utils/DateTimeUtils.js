export function getStrDateFromTime(hour, minute) {
    return new Date(2020, 2, 8, hour, minute).toISOString();
}

export function getDateFromISOString(isoDate) {
    return Date.parse(isoDate);
}

export function getFormattedDateTimeFromISOString(isoDate) {
    return formatDateTime(new Date(isoDate));
}

function formatDateTime(date) {
    return formatDate(date) + ' ' + formatTime(date);
}

export function formatDate(date) {
    let dd = getNumberWithLeadingZero(date.getDate());
    let MM = getNumberWithLeadingZero(date.getMonth() + 1);
    let yy = date.getFullYear();
    return dd + '.' + MM + '.' + yy;
}

export function formatTime(date) {
    let HH = getNumberWithLeadingZero(date.getHours());
    let mm = getNumberWithLeadingZero(date.getMinutes());
    return HH + ':' + mm;
}

function getNumberWithLeadingZero(num) {
    return num < 10 ? '0' + num : num;
}