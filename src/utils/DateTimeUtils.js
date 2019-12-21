export function getStrDateFromTime(hour, minute) {
    return new Date(2020, 2, 8, hour, minute).toISOString();
}

export function getDateFromISOString(isoDate) {
    return Date.parse(isoDate);
}

export function getFormattedDateFromISOString(isoDate) {
    return formatDate(new Date(isoDate));
}

function formatDate(date) {
    let dd = getNumberWithLeadingZero(date.getDate());
    let MM = getNumberWithLeadingZero(date.getMonth() + 1);
    let yy = getNumberWithLeadingZero(date.getFullYear() % 100);
    let HH = getNumberWithLeadingZero(date.getHours());
    let mm = getNumberWithLeadingZero(date.getMinutes());

    return dd + '.' + MM + '.' + yy + ' ' + HH + ':' + mm;
}

function getNumberWithLeadingZero(num) {
    return num < 10 ? '0' + num : num;
}