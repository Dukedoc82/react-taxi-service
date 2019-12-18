export function getStrDateFromTime(hour, minute) {
    return new Date(2020, 2, 8, hour, minute).toISOString();
}

export function getDateFromISOString(isoDate) {
    return Date.parse(isoDate);
}

export function getFormattedDateFromISOString(isoDate) {
    return new Date(isoDate).toLocaleString();
}